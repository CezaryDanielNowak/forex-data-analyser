import React from 'react';
import PropTypes from 'prop-types';
import BaseComponent from 'components/BaseComponent';

export default class PageTitle extends BaseComponent {
  className = 'ts-PageTitle';

  static propTypes = {
    align: PropTypes.oneOf(['left', 'right', 'center']),
    children: PropTypes.node,
    color: PropTypes.oneOf(['green', 'black', 'white']),
    context: PropTypes.node,
    hr: PropTypes.bool,
    size: PropTypes.oneOf(['huge', 'big', 'medium', 'small']),
    subtitle: PropTypes.node,
    theme: PropTypes.oneOf(['regular', 'light']),
    title: PropTypes.node.isRequired,
    underline: PropTypes.bool,
  };

  static defaultProps = {
    align: 'center',
    color: 'black',
    context: null,
    hr: false,
    size: 'medium',
    subtitle: null,
    theme: 'regular',
    underline: true,
  };

  renderSubtitle = () => {
    const { subtitle } = this.props;
    if (!subtitle) return null;
    switch (typeof subtitle) {
      case 'string':
        // TODO: remove this, or create prop for direct HTML injection
        return (
          <h2
            className={ this.cn`__subtitle` }
            /* eslint-disable react/no-danger */
            dangerouslySetInnerHTML={ { __html: subtitle } }
            /* eslint-enable */
          />
        );
      case 'object':
        return (
          <h2
            className={ this.cn`__subtitle` }
          >
            { subtitle }
          </h2>
        );
      default:
        return null;
    }
  };

  render() {
    const {
      align,
      color,
      context,
      hr,
      size,
      subtitle,
      theme,
      title,
      underline
    } = this.props;
    const classNames = {
      [`--${size}`]: size,
      [`--${align}`]: align,
      [`--${color}`]: color,
      [`--${theme}`]: theme,
      '--underline': underline,
      '--with-subtitle': subtitle,
      '--with-hr': hr,
    };
    return (
      <div className={ this.rootcn(classNames) }>
        <h1 className={ this.cn`__title` }>
          { title }
          { context && <span className={ this.cn`__context` }>({ context })</span> }
        </h1>
        { this.renderSubtitle() }
      </div>
    );
  }
}
