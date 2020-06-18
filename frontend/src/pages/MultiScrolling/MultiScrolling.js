import React from 'react';
import BasePage from 'pages/BasePage';
import PageTitle from 'components/PageTitle';

export default class MultiScrolling extends BasePage {
  className = 'ts-MultiScrolling';
  title = 'Page:MultiScrolling';

  render() {
    return (
      <div className={ this.rootcn`ts-container` }>
        <PageTitle title={ this.title } />
        { this.props.children }
      </div>
    );
  }
}
