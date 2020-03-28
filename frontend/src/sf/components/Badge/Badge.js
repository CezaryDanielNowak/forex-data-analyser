import React from 'react';
import PropTypes from 'prop-types';
import BaseComponent from 'components/BaseComponent';

export default class Badge extends BaseComponent {
  className = 'ts-Badge';

  static propTypes = {
    fluid: PropTypes.bool,
    children: PropTypes.node,
    size: PropTypes.oneOf(['big', 'medium', 'small']),
    theme: PropTypes.oneOf(['action', 'accent', 'no-theme']),
  };

  static defaultProps = {
    fluid: false,
    children: '',
    size: 'medium',
    theme: 'action',
  };

  render() {
    const { fluid, size, theme } = this.props;

    const classNames = {
      [`--theme-${theme}`]: theme,
      [`--${size}`]: true,
      '--fluid': fluid,
    };

    return (
      this.props.children &&
      <span className={ this.rootcn(classNames) }>
        { this.props.children }
      </span>
    );
  }
}
