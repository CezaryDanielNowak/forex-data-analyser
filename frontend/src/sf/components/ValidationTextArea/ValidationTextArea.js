import React from 'react';
import omit from 'lodash/omit';
import ValidationInput from 'sf/components/ValidationInput';

export default class ValidationTextArea extends ValidationInput {
  className = 'ts-ValidationTextArea';

  renderHint() {
    if (this.state.isValid === false && this.state.invalidMessage) {
      return (
        <div className={ this.cn`__hint __hint--error` } ref="hint">
          { this.state.invalidMessage }
        </div>
      );
    }

    return this.props.hint
      ? <div className={ this.cn`__hint` } ref="hint">{ this.props.hint }</div>
      : null;
  }

  render() {
    const isInvalid = this.state.isValid === false;
    const inputClassNames = {
      '__field': true,
      '__field--success': this.state.isValid,
      '__field--danger': this.state.isValid === false,
    };
    const wrapClassNames = {
      '__field-wrap': true,
      '__field-wrap--has-hint': isInvalid,
    };
    const stateLink = this.props.stateLink;
    const value = stateLink ? stateLink[0].state[stateLink[1]] : undefined;

    return (
      <div className={ this.rootcn`` }>
        { this.renderLabel() }
        <span
          className={ this.cn(wrapClassNames) }
        >
          <textarea
            ref="input"
            value={ value || '' }
            { ...omit(this.props, [
              'error', 'isValid', 'isValidatedByProp', 'mismatchInfo', 'displayName',
              'stateLink', 'maskOptions', 'permanentPlaceholder', 'unmask', 'parser',
            ]) }
            onChange={ this.handleChange }
            className={ this.cn(inputClassNames) }
          />
          { this.renderHint() }
        </span>
      </div>
    );
  }
}
