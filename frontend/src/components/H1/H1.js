import React, { PropTypes } from 'react';
import BaseComponent from 'components/BaseComponent';

export default class H1 extends BaseComponent {
  className = 'ts-H1';

  static propTypes = {
    children: PropTypes.node
  };

  static defaultProps = {
    children: ''
  };

  render() {
    return (
      <h1 className={ this.rootcn`` }>
        { this.props.sup && <div className={ this.cn`__sup` }>{ this.props.sup }</div> }
        { this.props.children }
      </h1>
    );
  }
}
