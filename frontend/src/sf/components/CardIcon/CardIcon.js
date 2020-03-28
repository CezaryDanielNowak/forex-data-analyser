import React from 'react';
import PropTypes from 'prop-types';
import BaseComponent from 'components/BaseComponent';

export default class CardIcon extends BaseComponent {
  className = 'ts-CardIcon';

  static propTypes = {
    type: PropTypes.string,
  };

  static defaultProps = {
    type: null,
  };

  render() {
    const { type } = this.props;
    return (
      <div className={ this.rootcn({ [`--${type}`]: !!type }) }></div>
    );
  }
}
