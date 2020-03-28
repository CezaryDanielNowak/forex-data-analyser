import React from 'react';
import omit from 'lodash/omit';
import PropTypes from 'prop-types';
import BaseComponent from 'components/BaseComponent';
import Button from 'sf/components/Button';
import Icon from 'sf/components/Icon';

/**
 * IconButton is simple stateless function component:
 * https://facebook.github.io/react/docs/reusable-components.html#stateless-functions
 */
export default class IconButton extends BaseComponent {
  className = 'ts-IconButton';

  static propTypes = {
    buttonType: PropTypes.oneOf([
      'button',
      'menu',
      'reset',
      'submit',
    ]),
    className: PropTypes.string,
    onClick: PropTypes.func.isRequired,
    type: PropTypes.string.isRequired,
    theme: PropTypes.string,
    title: PropTypes.string,
    iconSize: PropTypes.number,
    set: PropTypes.string,
  };

  static defaultProps = {
    buttonType: 'submit',
    iconSize: 24,
    set: 'io',
    theme: 'link',
  };

  renderChildren = () => {
    return this.props.children ? (
      <span
        className={ this.cn`__label` }
      >
        { this.props.children }
      </span>
    ) : null;
  }

  render() {
    return (
      <Button
        { ...omit(this.props, ['buttonType', 'iconSize', 'type']) }
        type={ this.props.buttonType }
        className={ this.rootcn`` }
      >
        <Icon
          className={ this.cn`__icon` }
          set={ this.props.set }
          type={ this.props.type }
          size={ this.props.iconSize }
        />
        { this.renderChildren() }
      </Button>
    );
  }
}
