import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { asset } from 'sf/helpers';

class Html extends Component {
  static propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
    children: PropTypes.string,
    entryPoint: PropTypes.string,
  };

  static defaultProps = {
    title: DEFAULT_PAGE_TITLE,
    description: '',
    entryPoint: 'app',
  };

  render() {
    return (
      <html lang={ LANGUAGE }>
        <head>
          <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
          <meta httpEquiv="Pragma" content="no-cache" />
          <meta httpEquiv="Expires" content="0" />
          <base href={ LANGUAGE === 'en' ? '/' : `/${LANGUAGE}/` } />
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <title>{ this.props.title }</title>
          <meta name="description" content={ this.props.description } />
          <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
          <meta name="theme-color" content="#332a2a" />
          <link
            rel="stylesheet"
            href={ asset`lib/react-select/react-select.min.css` }
            type="text/css"
          />
          <script src={ asset`babel-polyfill.js` } />
          <link rel="stylesheet" href={ asset`app-${LANGUAGE}.css` } type="text/css" />
        </head>
        <body className={ `brand-${BRAND_NAME}` }>
          { /* eslint-disable react/no-danger */ }
          <div id="app" dangerouslySetInnerHTML={ { __html: this.props.children } } />
          { /* eslint-enable */ }
          { ENV === 'local' ? null : <script defer={ true } src="https://browser.sentry-cdn.com/5.13.0/bundle.min.js" crossOrigin="anonymous"></script> }
          <script defer={ true } src="/lib/amcharts4/core.js"></script>
          <script defer={ true } src="/lib/amcharts4/charts.js"></script>
          <script defer={ true } src={ asset`${this.props.entryPoint}-${LANGUAGE}.js` } />
        </body>
      </html>
    );
    /* eslint-enable max-len, react/no-danger */
  }
}

export default Html;
