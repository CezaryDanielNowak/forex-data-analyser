import React from 'react';
import noop from 'no-op';
import PropTypes from 'prop-types';
import BaseComponent from 'components/BaseComponent';

export default class NativeSelect extends BaseComponent {
  /**
   * NativeSelect is just standard HTML select.
   * It does not reflect all features of Select, so please be conscious
   * when using it.
   */
  className = 'ts-SelectNative';

  static propTypes = {
    onChange: PropTypes.func,
  };

  static defaultProps = {
    onChange: noop,
  };

  handleChange = (e) => {
    const optionData = this.props.options.find(({ value }) => value === e.target.value);
    this.props.onChange(optionData);
  }

  render() {
    return (
      <div className={ this.rootcn() }>
        <select
          { ...this.pickProps() }
          value={ this.props.value || '' }
          onChange={ this.handleChange }
          tabIndex={ this.props.tabIndex }
          className={ this.cn`__select Select-control` }
        >
          <option key="placeholder" value="" disabled={ true }>Select one...</option>
          { this.props.options.map(({ label, value }) => {
            return (
              <option key={ value } value={ value }>{ label }</option>
            );
          }) }
        </select>
      </div>
    );
  }
}
