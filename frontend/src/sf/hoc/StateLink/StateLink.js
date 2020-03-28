import React from 'react';
import omit from 'lodash/omit';
import noop from 'no-op';
import PropTypes from 'prop-types';
import BaseComponent from 'components/BaseComponent';

export default function withStateLink(ComposedComponent) {
  return class StateLink extends BaseComponent {
    static propTypes = {
      onChange: PropTypes.func,
      stateLink: PropTypes.array.isRequired,
    };

    static defaultProps = {
      onChange: noop,
    };

    setValid = (...args) => this.refs.component.setValid(...args);

    handleChange = (value) => {
      const [context, stateField] = this.props.stateLink;
      context.setState({
        [stateField]: value,
      }, () => {
        this.props.onChange(value);
      });
    };

    render() {
      const [context, stateField] = this.props.stateLink;
      const value = context.state[stateField] || '';
      return (
        <ComposedComponent
          { ...omit(this.props, ['stateLink', 'onChange']) }
          ref="component"
          value={ value }
          onChange={ this.handleChange }
        />
      );
    }
  };
}
