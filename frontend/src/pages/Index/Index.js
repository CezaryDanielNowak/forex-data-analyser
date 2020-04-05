import React from 'react';
import {
  PAGE_INDEX_TITLE,
} from 'l10n';
import BasePage from 'pages/BasePage';
import RatioCompareChart from 'components/RatioCompareChart';
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
            <RatioCompareChart sources={ [ 'GER30Cash_M1.CSV', 'POL20Cash_M1.CSV' ] } />
          </div>
        </div>
      </div>
    );
  }
}
