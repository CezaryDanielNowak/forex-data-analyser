import React from 'react';
import PropTypes from 'prop-types';
import BaseComponent from 'components/BaseComponent';
import Button from 'sf/components/Button';

export default class ButtonOptions extends BaseComponent {
  className = 'ts-ButtonOptions';

  state = {};

  static propTypes = {
    options: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.string,
        label: PropTypes.node,
      }),
    ),
    header: PropTypes.node,
    onChange: PropTypes.func.isRequired,
    maxColumns: PropTypes.number,
    value: PropTypes.string,
    size: PropTypes.string,
  };

  static defaultProps = {
    maxColumns: 6,
    options: [],
    size: Button.defaultProps.size,
  };

  get value() {
    return 'value' in this.state ?
      this.state.value
      : this.props.value;
  }

  set value(value) {
    const oldVal = this.value;

    if (!this.state.isValid) {
      this.setValid(true);
    }

    this.setState({ value }, () => {
      if (oldVal === value) return;

      this.props.onChange(value);
    });
  }

  setValid = (status, invalidMessage) => { // public
    this.setState({
      isValid: status,
      invalidMessage: status ? false : invalidMessage,
    });
  };

  focus = () => ( // public
    this.buttonNode && this.buttonNode.focus()
  );

  render() {
    if (!this.props.options.length) return null;

    const classNames = {
      '--has-error': !this.state.isValid,
    };

    return (
      <div
        { ...this.pickProps() }
        className={ this.rootcn(classNames) }
        data-toggle=""
      >
        { this.props.header &&
          <h2 key="header" className={ this.cn`__header` }>
            { this.props.header }
          </h2>
        }

        { this.state.invalidMessage && (
          <div key="invalidMsg" className={ this.cn`__form-error` }>
            { this.state.invalidMessage }
          </div>
        ) }

        <div className={ this.cn`__options-wrapper` }>
          { this.props.options.map(({ value, label }) => (
            <Button
              key={ value }
              ref={ this.createRef('buttonNode') }
              type="button"
              size={ this.props.size }
              className={ this.cn({
                '__button': true,
                '__button--active': this.value === value,
                [`__button--size-${this.props.size}`]: true,
              }) }
              onClick={ () => {
                this.value = value;
              } }
            >
              { label }
            </Button>
          )) }
        </div>
      </div>
    );
  }
}
