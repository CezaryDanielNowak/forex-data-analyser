import React from 'react';
import PropTypes from 'prop-types';
import BaseComponent from 'components/BaseComponent';
import Button from 'sf/components/Button';
import Icon from 'sf/components/Icon';
import omit from 'lodash/omit';

/**
 * IconButton is simple stateless function component:
 * https://facebook.github.io/react/docs/reusable-components.html#stateless-functions
 * - Is it?
 */
export default class IconButton extends BaseComponent {
  className = 'ts-IconButton';

  static propTypes = {
    className: PropTypes.string,
    onClick: PropTypes.func.isRequired,
    type: PropTypes.string.isRequired,
    theme: PropTypes.string,
    iconSize: PropTypes.number,
    set: PropTypes.string,
  };

  static defaultProps = {
    iconSize: 24,
    set: 'io', // NOTE: default for Icon is fa. This is misleading
    theme: 'link'
  };

  render() {
    return (
      <Button
        { ...omit(this.props, ['iconSize']) }
        className={ this.rootcn`` }
      >
        <Icon
          className={ this.cn('__icon') }
          set={ this.props.set }
          type={ this.props.type }
          size={ this.props.iconSize }
        />
        { this.props.children }
      </Button>
    );
  }
}
