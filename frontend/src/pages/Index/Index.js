import React from 'react';
import {
  PAGE_INDEX_TITLE,
} from 'l10n';
import BasePage from 'pages/BasePage';


export default class Index extends BasePage {
  className = 'ts-Index';
  title = PAGE_INDEX_TITLE;

  componentDidMount() {

  }

  render() {
    return (
      <div className={ this.rootcn`` }>
        <div className="ts-container">
          <div className={ this.cn`__content` }>

          </div>
        </div>
      </div>
    );
  }
}
