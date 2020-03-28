import React from 'react';
import BaseComponent from 'components/BaseComponent';
import Icon from 'sf/components/Icon';

export default class NegativeListIcon extends BaseComponent {
  className = 'ts-NegativeListIcon';

  render() {
    return (
      <Icon
        className={ this.rootcn() }
        { ...this.props }
        set="fa"
        type="exclamation-circle"
        color="red"
      >
        this person has been added to the negative list
      </Icon>
    );
  }
}
