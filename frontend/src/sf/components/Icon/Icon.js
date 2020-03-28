/* eslint-disable react/no-danger */
import React from 'react';
import PropTypes from 'prop-types';
import BaseComponent from 'components/BaseComponent';
import model from './model';

export default class Icon extends BaseComponent {
  className = 'ts-Icon';

  static propTypes = {
    children: PropTypes.string,
    color: PropTypes.string,
    external: PropTypes.bool,
    href: PropTypes.string,
    set: PropTypes.oneOf(['fa', 'io', 'ts']),
    size: PropTypes.number,
    style: PropTypes.object,
    type: PropTypes.string.isRequired,
  };

  static defaultProps = {
    children: '',
    color: null,
    external: false,
    href: null,
    set: 'fa',
    size: 16,
    style: {},
  };

  state = {
    icon: model.get(`${this.props.set}/${this.props.type}`) || '',
  };

  componentDidMount() {
    this.updateIcon(this.props);
  }

  componentWillUpdate(nextProps) {
    this.updateIcon(nextProps);
  }

  updateIcon({ type, set }) {
    model.fetchIcon(type, set, (icon) => {
      if (!this.isDestroyed) {
        this.setState({
          icon,
        });
      }
    });
  }

  render() {
    const { size, type, color, href, external, style, children } = this.props;
    const classNames = {
      [`--${type}`]: true,
    };
    const className = this.rootcn(classNames);
    const defaultStyle = {
      color: color,
      height: `${size}px`,
      lineHeight: `${size}px`,
      width: `${size}px`,
    };

    if (href) {
      return (
        <a
          href={ href }
          target={ external ? '_blank' : '' }
          className={ className }
          style={ { ...defaultStyle, ...style } }
          title={ children }
          dangerouslySetInnerHTML={ { __html: this.state.icon } }
        />
      );
    }
    return (
      <span
        className={ className }
        style={ { ...defaultStyle, ...style } }
        title={ children }
        dangerouslySetInnerHTML={ { __html: this.state.icon } }
      />
    );
  }
}
