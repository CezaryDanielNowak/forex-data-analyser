import React from 'react';
import PropTypes from 'prop-types';
import BaseComponent from '../BaseComponent';


export default class PageTitle extends BaseComponent {
  className = 'ts-PageTitle';

  static propTypes = {
    align: PropTypes.oneOf(['left', 'right', 'center']),
    color: PropTypes.oneOf(['black', 'white']),
    title: PropTypes.node.isRequired,
    subtitle: PropTypes.node,
    context: PropTypes.node,
    size: PropTypes.oneOf(['huge', 'big', 'medium', 'small'])
  };

  static defaultProps = {
    align: 'center',
    color: 'black',
    subtitle: null,
    context: null,
    size: 'medium'
  };

  render() {
    const { align, color, title, subtitle, context, size } = this.props;
    const className = {
      [`--${size}`]: size,
      [`--${align}`]: align,
      [`--${color}`]: color,
      '--with-subtitle': subtitle,
      '--with-hr': this.props.hr
    };

    return (
      <div className={ this.rootcn(className) }>
        <h1
          className={ this.cn`__title` }
        >
          { title }
          { context && <span className={ this.cn('__context') }>({ context })</span> }
        </h1>
        { subtitle && <h2 className={ this.cn('__subtitle') }>{ subtitle }</h2> }
      </div>
    );
  }
}
