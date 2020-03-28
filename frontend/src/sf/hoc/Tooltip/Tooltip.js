import React from 'react';
import omit from 'lodash/omit';
import is from 'next-is';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';
import BaseComponent from 'components/BaseComponent';

// TODO: Fix hiding tooltip on Android in a more civilised way
// Something's calling the method below on Android,
// we don't use it in our app (it hides all the tooltips)
ReactTooltip.hide = () => {};

export default function withTooltip(ComposedComponent) {
  return class Tooltip extends BaseComponent {
    className = 'ts-Tooltip';

    static propTypes = {
      showOnMobile: PropTypes.bool,
      tooltipPosition: PropTypes.string,
      tooltipText: PropTypes.node,
    };

    static defaultProps = {
      showOnMobile: true,
      tooltipPosition: null,
      tooltipText: null,
    };

    render() {
      const showTooltip = this.props.showOnMobile ||
        !is.mobile();
      return [
        <ComposedComponent
          { ...omit(this.props, [
            'showOnMobile',
            'tooltipPosition',
            'tooltipText',
          ]) }
          key="component"
          data-tip=""
          data-for={ `tooltip-${this.componentId}` }
        />,
        showTooltip && <ReactTooltip
          class={ this.cn`__tooltip` }
          effect="solid"
          id={ `tooltip-${this.componentId}` }
          key="tooltip"
          place={ this.props.tooltipPosition }
        >
          { this.props.tooltipText }
        </ReactTooltip>,
      ].filter((element) => element);
    }
  };
}
