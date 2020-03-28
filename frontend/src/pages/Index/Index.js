import React from 'react';
import {
  PAGE_INDEX_TITLE,
} from 'l10n';
import BasePage from 'pages/BasePage';
import Button from 'sf/components/Button';
import { ROUTES } from 'constants';
import DateBasedLineChart from 'components/DateBasedLineChart';
import api from 'models/api';

global.api = api;

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

            <DateBasedLineChart />
          </div>
        </div>
      </div>
    );
  }
}
