import React from 'react';
import BasePage from 'pages/BasePage';
import PageTitle from 'components/PageTitle';
import RatioCompareChart from 'components/RatioCompareChart';

export default class CorrelationCharts extends BasePage {
  className = 'ts-CorrelationCharts';
  title = 'Correlation Charts';

  render() {
    return (
      <div className={ this.rootcn`ts-container` }>
        <RatioCompareChart sources={ [ 'GER30Cash_M1.CSV', 'POL20Cash_M1.CSV' ] } />
        <RatioCompareChart sources={ [ 'EU50Cash_M1.CSV', 'US100Cash_M1.CSV' ] } />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
      </div>
    );
  }
}
