import React from 'react';
import noop from 'no-op';
import PropTypes from 'prop-types';
import BaseComponent from 'components/BaseComponent';
import Icon from 'sf/components/Icon';
import { generateToken } from 'sf/helpers';

const ID_LENGTH = 8;

export default class Checkbox extends BaseComponent {
  className = 'ts-Checkbox';

  static propTypes = {
    onChange: PropTypes.func,
  };

  static defaultProps = {
    onChange: noop,
  };

  constructor(props) {
    super(props);
    this.id = generateToken(ID_LENGTH);
    this.state = {
      checked: props.value,
    };
  }

  handleChange = (e) => {
    this.props.onChange(e.target.checked);
    this.setState({ checked: e.target.checked });
  };

  render() {
    const id = this.props.id || this.id;
    const { checked } = this.state;
    const checkedClassNames = {
      '__icon': true,
      '__icon--visible': checked,
    };
    const unCheckedClassNames = {
      '__icon': true,
      '__icon--visible': !checked,
    };
    return (
      <div className={ this.rootcn() }>
        <input
          className={ this.cn`__input` }
          id={ id }
          type="checkbox"
          onChange={ this.handleChange }
        />
        <label
          className={ this.cn`__label` }
          htmlFor={ id }
        >
          <Icon
            className={ this.cn(checkedClassNames) }
            set="ts"
            size={ 24 }
            type="checkbox-outline"
          />
          <Icon
            className={ this.cn(unCheckedClassNames) }
            set="ts"
            size={ 24 }
            type="square-outline"
          />
        </label>
      </div>
    );
  }
}
