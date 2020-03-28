import React from 'react';
import PropTypes from 'prop-types';
import BaseComponent from 'components/BaseComponent';
import PillButton from 'sf/components/PillButton';

export default class NotificationPill extends BaseComponent {
  className = 'ts-NotificationPill';

  static propTypes = {
    children: PropTypes.node,
  };

  static defaultProps = {
    children: '',
  };

  render() {
    if (!this.props.children) return null;

    return (
      <sup>
        <PillButton
          { ...this.props }
          className={ this.rootcn`` }
        >
          { this.props.children }
        </PillButton>
      </sup>
    );
  }
}
