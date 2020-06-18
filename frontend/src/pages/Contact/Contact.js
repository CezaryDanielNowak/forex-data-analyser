import React from 'react';
import BasePage from 'pages/BasePage';
import PageTitle from 'components/PageTitle';

export default class Contact extends BasePage {
  className = 'ts-Contact';
  title = 'Page:Contact';

  render() {
    return (
      <div className={ this.rootcn`ts-container` }>
        <PageTitle title={ this.title } />
        { this.props.children }
      </div>
    );
  }
}
