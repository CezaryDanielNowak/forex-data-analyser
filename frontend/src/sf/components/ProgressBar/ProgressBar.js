import React from 'react';
import PropTypes from 'prop-types';
import BaseComponent from 'components/BaseComponent';

import './ProgressBar.scss';

export default class ProgressBar extends BaseComponent {
  className = 'ts-ProgressBar';

  static propTypes = {
    circleRadius: PropTypes.number,
    color: PropTypes.string,
    max: PropTypes.number,
    size: PropTypes.number,
    step: PropTypes.number,
    type: PropTypes.string,
    value: PropTypes.number.isRequired,
  };

  static defaultProps = {
    circleRadius: 10,
    color: 'red',
    max: 100,
    size: 36,
    step: 5,
    type: 'ring',
  };

  renderVisuals() {
    const { type, color, value, max, circleRadius } = this.props;
    const circumference = circleRadius * 2 * Math.PI;

    switch (type) {
      case 'ring':
        // SOURCE: https://codepen.io/anon/pen/QYPGgZ
        return (
          <svg
            className={ this.cn`__progress-ring` }
            width="36"
            height="36"
            key={ type }
          >
            <circle
              className={ this.cn`__progress-ring__circle` }
              stroke={ color }
              strokeWidth="12"
              fill="transparent"
              r={ circleRadius }
              cx="17"
              cy="18"
              style={ {
                strokeDasharray: `${circumference} ${circumference}`,
                strokeDashoffset: circumference - value / max * circumference,
              } }
            />
          </svg>
        );
      default:
        return (
          <progress
            key={ type }
            value={ value }
            max={ max }
            className={ this.cn`__progress-default` }
          />
        );
    }
  }

  render() {
    return (
      <div
        className={ this.rootcn() }
        style={ { transform: `scale(${this.props.size / 36})` } }
        data-value={ this.props.value }
        data-max={ this.props.max }
      >
        { this.renderVisuals() }
      </div>
    );
  }
}
