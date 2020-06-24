import React from 'react';
import BasePage from 'pages/BasePage';
import PageTitle from 'components/PageTitle';
import DayByDayChart from 'components/DayByDayChart';

export default class DayByDay extends BasePage {
  className = 'ts-DayByDay';
  title = 'DayByDay';

  render() {
    return (
      <div className={ this.rootcn() }>
        <PageTitle title={ this.title } />
        <DayByDayChart source="GER30Cash_M1.CSV" />
      </div>
    );
  }
}
