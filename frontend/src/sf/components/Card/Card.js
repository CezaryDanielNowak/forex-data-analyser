import React from 'react';
import omit from 'lodash/omit';
import PropTypes from 'prop-types';

import BaseComponent from 'components/BaseComponent';
import device from 'sf/models/device';

export default class Card extends BaseComponent {
  className = 'ts-Card';

  state = {};

  static propTypes = {
    fullWidth: PropTypes.bool,
    shadow: PropTypes.bool,
    size: PropTypes.oneOf(['big', 'small']),
  };

  static defaultProps = {
    fullWidth: false,
    size: 'big',
    shadow: true,
  };

  componentDidMount() {
    this.syncStateWithModel(device, ['xsmUp']);
  }

  render() {
    const { size, shadow } = this.props;
    const fullWidth = this.props.fullWidth && !this.state.xsmUp;
    const classNames = {
      '--small': size === 'small',
      '--shadow': shadow,
      '--full-width': fullWidth,
    };
    return (
      <div
        { ...omit(this.props, Object.keys(Card.defaultProps)) }
        className={ this.rootcn(classNames) }
      >
        { this.props.children }
      </div>
    );
  }
}
