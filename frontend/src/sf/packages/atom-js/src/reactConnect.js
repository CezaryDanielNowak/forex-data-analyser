const React = require('react');

const lifeCycleMethods = [
  'componentDidCatch',
  'componentDidMount',
  'componentDidUpdate',
  'componentWillMount',
  'componentWillReceiveProps',
  'componentWillUnmount',
  'componentWillUpdate',
  'getSnapshotBeforeUpdate',
  'render',
  'shouldComponentUpdate',
  'UNSAFE_componentWillMount',
  'UNSAFE_componentWillReceiveProps',
  'UNSAFE_componentWillUpdate',
  'constructor',
  'length',
  'toString',
];

module.exports = (modelOrName, fieldsToInclude) => {
  return (Component) => {
    const listeners = [];

    class ComposedAtomComponent extends React.PureComponent {
      constructor(props) {
        super(props);

        const modelToSync = typeof modelOrName === 'string'
          ? props[modelOrName]
          : modelOrName;
        this.state = this.syncStateWithModel(modelToSync, fieldsToInclude);
      }

      componentWillUnmount() {
        listeners.forEach((remove) => remove());
        listeners.length = 0;
      }

      getComponent() {
        return this.refs.component;
      }

      /**
       * Copy data from the model into state.
       * state will be synced.
       * @param  {Object} model  atom model object
       * @param  {Array} fieldsToInclude  Use it to sync just selected fields
       * @return {void}
       */
      syncStateWithModel(model) {
        const modelState = {};

        fieldsToInclude.forEach((key) => {
          modelState[key] = model.get(key);
          this.syncOnModelChange(model, key);
        });

        return modelState;
      }

      syncOnModelChange = (model, key) => {
        const args = [
          key,
          (value) => {
            this.setState({
              [key]: value,
            });
          },
        ];
        model.on(...args);
        listeners.push(() => {
          model.off(...args);
        });
      }

      render() {
        return (
          <Component ref="component" { ...this.state } { ...this.props } />
        );
      }
    }

    // Add all non-prototype methods here.
    Object.getOwnPropertyNames(Component.prototype)
      .forEach((key) => {
        const value = Component.prototype[key];

        if (
          typeof value === 'function'
          && !lifeCycleMethods.includes(key)
          && !ComposedAtomComponent.prototype[key]
        ) {
          ComposedAtomComponent.prototype[key] = function (...args) {
            const component = this.getComponent();
            if (!component) {
              // eslint-disable-next-line max-len
              throw new Error(`ComposedAtomComponent can't call "${key}" function, when wrapped component is not available.`);
            }

            return value.apply(component, args);
          };
        }
      });

    ComposedAtomComponent.__WRAPPED_COMPONENT__ = Component;

    return ComposedAtomComponent;
  };
};
