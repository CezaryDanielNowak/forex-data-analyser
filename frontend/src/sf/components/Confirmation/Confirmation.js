import React from 'react';
import PropTypes from 'prop-types';
import PageTitle from 'components/PageTitle';
import BaseComponent from 'components/BaseComponent';

export default class Confirmation extends BaseComponent {
  className = 'ts-Confirmation';

  static propTypes = {
    message: PropTypes.node,
    title: PropTypes.string,
    upperMessage: PropTypes.node,
  };

  static defaultProps = {
    message: null,
    title: null,
    upperMessage: null,
  }

  render() {
    const { message, title, upperMessage } = this.props;
    return (
      <div
        className={ this.rootcn() }
      >
        { upperMessage &&
          <span className={ this.cn`__upper-message` }>
            { this.props.upperMessage }
          </span> }
        <div className={ this.cn`__tick` }>
          { /* eslint-disable max-len */ }
          <svg className={ this.cn`__circle` } width="73px" height="73px" viewBox="563 174 73 74">
            <ellipse className={ this.cn`__circle-path` } stroke="#00AD68" strokeWidth="2" fill="none" cx="599.5" cy="210.5" rx="35.5" ry="35.5"></ellipse>
          </svg>
          <svg className={ this.cn`__check` } width="39px" height="27px" viewBox="580 197 39 27">
            <polyline className={ this.cn`__check-path` } stroke="#00AD68" strokeWidth="2" fill="none" points="581 210.215158 593.392421 222.607579 618 198"></polyline>
          </svg>
          { /* eslint-enable */ }
        </div>
        { title &&
          <PageTitle
            className={ this.cn`__title` }
            hr={ true }
            title={ this.props.title }
          /> }
        { message &&
          <span className={ this.cn`__message` }>
            { this.props.message }
          </span> }
      </div>
    );
  }
}
