import React from 'react';
import PropTypes from 'prop-types';
import flatMap from 'lodash/flatMap';
import noop from 'no-op';
import BaseComponent from 'components/BaseComponent';
import Button from 'sf/components/Button';

export default class AltValues extends BaseComponent {
  className = 'ts-AltValues';

  static propTypes = {
    values: PropTypes.arrayOf(PropTypes.string).isRequired,
    template: PropTypes.shape({
      prefix: PropTypes.string,
      suffix: PropTypes.string,
      connector: PropTypes.string,
      lastConnector: PropTypes.string,
    }).isRequired,
    onClick: PropTypes.func,
  };

  static defaultProps = {
    onClick: noop,
  };

  renderAltValueButton = (text, index) => (
    <Button
      className={ this.cn`__button` }
      key={ `button-${text}` }
      tabIndex="-1"
      theme="link-unstyled"
      type="button"
      onClick={ this.props.onClick(index) }
    >
      { text }
    </Button>
  );

  renderAltValueSpan = (index) => {
    const { prefix, suffix, connector, lastConnector } = this.props.template;
    const { length } = this.props.values;
    let text;
    switch (index) {
      case 0:
        text = prefix;
        break;
      case length:
        text = suffix;
        break;
      case length - 1:
        text = lastConnector;
        break;
      default:
        text = connector;
        break;
    }
    return (
      <span
        key={ `span-${index}` }
      >
        { text }
      </span>
    );
  };

  render() {
    const nodesToRender = flatMap(
      [...this.props.values, null],
      (text, index) => [
        this.renderAltValueSpan(index),
        this.renderAltValueButton(text, index),
      ]
    );
    nodesToRender.pop();
    return nodesToRender.length > 1 ? (
      <div className={ this.rootcn() }>
        { nodesToRender }
      </div>
    ) : null;
  }
}
