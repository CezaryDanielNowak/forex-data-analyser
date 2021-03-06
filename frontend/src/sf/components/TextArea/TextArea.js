import React from 'react';
import noop from 'no-op';
import PropTypes from 'prop-types';
import BaseComponent from 'components/BaseComponent';

export default class TextArea extends BaseComponent {
  className = 'ts-TextArea';

  static propTypes = {
    parser: PropTypes.func,
    placeholder: PropTypes.string,
    type: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    parser: (v) => v,
    placeholder: '',
    type: 'text',
    value: '',
    onChange: noop,
  };

  handleChange = (e) => {
    this.props.onChange(
      this.props.parser(e.target.value),
    );
  }

  render() {
    return (
      <textarea
        { ...this.pickProps(
          'placeholder',
          'value',
          'type',
          'maxLength',
          'minLength',
        ) }
        className={ this.rootcn() }
        onChange={ this.handleChange }
      />
    );
  }
}
