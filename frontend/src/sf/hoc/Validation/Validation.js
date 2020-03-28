import React from 'react';
import noop from 'no-op';
import PropTypes from 'prop-types';
import BaseComponent from 'components/BaseComponent';

export default function withValidation(ComposedComponent) {
  return class Validation extends BaseComponent {
    className = 'ts-Validation';

    state = {
      isValid: true,
    };

    static propTypes = {
      className: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object,
        PropTypes.array,
      ]),
      onChange: PropTypes.func,
    };

    static defaultProps = {
      className: null,
      onChange: noop,
    };

    handleChange = (value) => {
      this.setValid(true);
      this.props.onChange(value);
    };

    setValid = (status, invalidMessage) => { // public
      this.setState({
        isValid: status,
        invalidMessage: status ? false : invalidMessage,
      });
    };

    render() {
      const { className } = this.props;
      const composedClassNames = {
        '__input': true,
        '--with-error': !this.state.isValid,
        [className]: className,
      };
      return (
        <div className={ this.rootcn() }>
          <ComposedComponent
            { ...this.props }
            className={ this.cn(composedClassNames) }
            onChange={ this.handleChange }
          />
          { !this.state.isValid &&
            <div
              className={ this.cn`__hint __hint--error` }
            >
              { this.state.invalidMessage }
            </div> }
        </div>
      );
    }
  };
}
