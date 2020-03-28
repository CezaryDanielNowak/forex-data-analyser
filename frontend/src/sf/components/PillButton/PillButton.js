import React from 'react';
import noop from 'no-op';
import PropTypes from 'prop-types';
import BaseComponent from 'components/BaseComponent';
import Icon from 'sf/components/Icon';
import Render from 'sf/components/Render';

export default class PillButton extends BaseComponent {
  className = 'ts-PillButton';

  static propTypes = {
    children: PropTypes.node,
    icon: PropTypes.string,
    iconSet: PropTypes.string,
    onClick: PropTypes.func,
    shell: PropTypes.bool,
    type: PropTypes.oneOf(['action', 'error', 'default']),
  };

  static defaultProps = {
    children: '',
    iconSet: 'io',
    onClick: noop,
    shell: false,
    type: 'default',
  };

  render() {
    const className = {
      [`--${this.props.type}`]: true,
      '--hover': this.props.onClick !== noop,
      '--shell': this.props.shell,
    };
    return (
      <button
        className={ this.rootcn(className) }
        onClick={ this.props.onClick }
      >
        <Render when={ this.props.icon }>
          <span className={ this.cn`__icon` }>
            { this.props.icon && <Icon set={ this.props.iconSet } type={ this.props.icon } /> }
          </span>
        </Render>
        <span className={ this.cn`__label` }>
          { this.props.children }
        </span>
      </button>
    );
  }
}
