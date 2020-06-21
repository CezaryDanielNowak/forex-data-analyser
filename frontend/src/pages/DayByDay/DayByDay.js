import React from 'react';
import BasePage from 'pages/BasePage';
import PageTitle from 'components/PageTitle';

export default class DayByDay extends BasePage {
  className = 'ts-DayByDay';
  title = 'DayByDay';

  render() {
    return (
      <div className={ this.rootcn`ts-container` }>
        <PageTitle title={ this.title } />
        { this.props.children }
      </div>
    );
  }
}
