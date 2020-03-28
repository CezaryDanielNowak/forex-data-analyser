import React from 'react';
import noop from 'no-op';
import PropTypes from 'prop-types';
import ReactSelect, { Creatable } from 'react-select';
import BaseComponent from 'components/BaseComponent';

export default class MultipleInput extends BaseComponent {
  className = 'ts-MultipleInput';

  static propTypes = {
    allowNewOptions: PropTypes.bool,
    options: PropTypes.array,
    parser: PropTypes.func,
    placeholder: PropTypes.string,
    placeholderAlwaysVisible: PropTypes.bool,
    showOptions: PropTypes.bool,
    stateLink: PropTypes.array.isRequired,
    value: PropTypes.array,
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
  };

  static defaultProps = {
    allowNewOptions: true,
    parser: (input) => input,
    placeholder: '',
    placeholderAlwaysVisible: true,
    showOptions: false,
    options: [],
    value: [],
    onBlur: noop,
    onFocus: noop,
  };

  state = {};

  handleBlur = (e) => {
    this.setState({ placeholderVisible: !!this.props.placeholderAlwaysVisible });
    this.props.onBlur(e);
  };

  handleChange = (newValues) => {
    this.setState(
      { values: newValues },
      () => {
        const [context, field] = this.props.stateLink;
        context.setState({
          [field]: newValues.map(({ value }) => value),
        }, this.props.onChange);
      },
    );
  };

  handleFocus = (e) => {
    this.setState({ placeholderVisible: true });
    this.props.onFocus(e);
  };


  renderLabel = () => this.props.displayName ? (
    <label
      htmlFor={ `${this.className}-${this.componentId}` }
      className={ this.cn`__label` }
    >
      { this.props.displayName }
    </label>
  ) : null;

  render() {
    const classNames = {
      '--without-options': !this.props.showOptions,
      '--with-options': this.props.showOptions,
    };
    const Component = this.props.allowNewOptions ? Creatable : ReactSelect;
    const placeholder = this.state.placeholderVisible ? this.props.placeholder : '';
    return (
      <div
        className={ this.rootcn(classNames) }
      >
        { this.renderLabel() }
        <Component
          id={ `${this.className}-${this.componentId}` }
          className={ this.cn`__select` }
          multi={ true }
          options={ this.props.options }
          placeholder={ placeholder }
          value={ this.state.values || this.props.value }
          onBlur={ this.handleBlur }
          onChange={ this.handleChange }
          onFocus={ this.handleFocus }
          // TODO: Update react-select when onInputChange starts working
          // https://github.com/JedWatson/react-select/issues/1283
          onInputChange={ this.props.parser }
        />
      </div>
    );
  }
}
