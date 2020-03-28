import React from 'react';
import PropTypes from 'prop-types';
import BaseComponent from 'components/BaseComponent';
import Icon from 'sf/components/Icon';

const ICON_CONFIG = {
  danger: {
    set: 'io',
    type: 'ios-information',
  },
  info: {
    set: 'io',
    type: 'ios-information',
  },
  warning: {
    set: 'io',
    type: 'ios-information',
  },
};

const TYPES = ['info', 'warning', 'danger'];
const SIZES = ['small', 'default'];

export default class Hint extends BaseComponent {
  className = 'ts-Hint';

  static TYPES = TYPES;
  static SIZES = SIZES;

  static propTypes = {
    children: PropTypes.node.isRequired,
    inline: PropTypes.bool,
    size: PropTypes.oneOf(SIZES),
    type: PropTypes.oneOf(TYPES),
    withIcon: PropTypes.bool,
  };

  static defaultProps = {
    inline: false,
    size: 'default',
    type: 'warning',
    withIcon: true,
  };

  getIcon = () => ICON_CONFIG[this.props.type];

  getIconSize = () => {
    switch (this.props.size) {
      case 'small':
        return 16;
      default:
        return 22;
    }
  };

  render() {
    const { children, inline, size, type, withIcon } = this.props;
    const classNames = {
      [`--type-${type}`]: true,
      [`--size-${size}`]: true,
      '--inline': inline,
    };
    const iconClassNames = {
      '__icon': true,
      [`__icon--type-${type}`]: true,
    };
    return (
      <div
        className={ this.rootcn(classNames) }
      >
        { withIcon &&
          <Icon
            className={ this.cn(iconClassNames) }
            size={ this.getIconSize() }
            { ...this.getIcon() }
          /> }
        { children }
      </div>
    );
  }
}
