import React from 'react';
import PropTypes from 'prop-types';
import BaseComponent from 'components/BaseComponent';
import Icon from 'sf/components/Icon';
import { getConfig } from 'sf';

class Spinner extends BaseComponent {
  className = 'ts-Spinner';

  static propTypes = {
    size: PropTypes.oneOfType([
      PropTypes.oneOf(['small', 'medium', 'big']),
      PropTypes.number,
    ]),
  };

  static defaultProps = {
    size: 'medium',
  };

  sizes = {
    medium: 80,
  };

  render() {
    const classNames = {
      [`--${this.props.size}`]: true,
    };
    return (
      <div className={ this.rootcn(classNames) }>
        <Icon
          className={ this.cn`__circle` }
          set="fa"
          type="repeat"
          size={ this.sizes[this.props.size] || this.props.size }
        />
      </div>
    );
  }
}

export default getConfig('SpinnerComponent') || Spinner;
