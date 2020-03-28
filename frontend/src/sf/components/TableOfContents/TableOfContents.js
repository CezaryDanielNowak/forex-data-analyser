import React from 'react';
import PropTypes from 'prop-types';
import BaseComponent from 'components/BaseComponent';
import Button from 'sf/components/Button';

export default class TableOfContents extends BaseComponent {
  className = 'ts-TableOfContents';

  static propTypes = {
    contents: PropTypes.array.isRequired,
    onItemClick: PropTypes.func.isRequired,
  };

  renderContents = () => this.props.contents
    .map((title) => (
      <li
        className={ this.cn`__item` }
        key={ title }
      >
        <Button
          className={ this.cn`__item-button` }
          theme="link"
          onClick={ this.props.onItemClick(title) }
        >
          { title }
        </Button>
      </li>
    ));

  render() {
    return (
      <nav
        className={ this.rootcn() }
      >
        <h2 className={ this.cn`__title` }>
          { this.props.title }
        </h2>
        <ol className={ this.cn`__list` }>
          { this.renderContents() }
        </ol>
      </nav>
    );
  }
}
