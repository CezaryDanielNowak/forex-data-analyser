import React from 'react';
import BasePage from 'pages/BasePage';
import RatioCompareChart from 'components/RatioCompareChart';

export default class CorrelationCharts extends BasePage {
  className = 'ts-CorrelationCharts';
  title = 'Correlation Charts';

  render() {
    return (
      <div className={ this.rootcn`ts-container` }>
        <RatioCompareChart sources={ ['GER30Cash_M1.CSV', 'POL20Cash_M1.CSV'] } />
      </div>
    );
  }
}
