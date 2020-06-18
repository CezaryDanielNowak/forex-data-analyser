import React from 'react';
import BasePage from 'pages/BasePage';
import PageTitle from 'components/PageTitle';

export default class AroundHolidays extends BasePage {
  className = 'ts-AroundHolidays';
  title = 'Page:AroundHolidays';

  render() {
    return (
      <div className={ this.rootcn`ts-container` }>
        <PageTitle title={ this.title } />
        { this.props.children }
      </div>
    );
  }
}
