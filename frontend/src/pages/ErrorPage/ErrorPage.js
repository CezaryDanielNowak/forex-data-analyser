import React from 'react';
import BasePage from 'pages/BasePage';
import { asset } from 'sf/helpers';

import { PAGE_ERROR_TITLE } from 'l10n';

export default class ErrorPage extends BasePage {
  className = 'ts-ErrorPage';
  title = PAGE_ERROR_TITLE;

  render() {
    return (
      <div className={ this.rootcn`ts-container` }>
        <img alt="404 Error" src={ asset`img/404.png` } className={ this.cn('__img') } />
      </div>
    );
  }
}
