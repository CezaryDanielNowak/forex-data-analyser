global.ENV_VARS = {
  ...(global.ENV_VARS || {})
};

require('app.scss');

// load polyfills form `sf` first.
require('sf').configure({
  assetsURL: ASSETS_URL,
  backendURL: BACKEND_URL,
});

const Html = require('layout/Html');
const is = require('next-is');
const React = require('react');
const ReactDOM = require('react-dom');
const Routes = require('./routes');
const { Router, browserHistory, match } = require('react-router');

const AdminHtml = (props) => <Html { ...props } entryPoint="admin" />;

if (typeof window === 'undefined') {
  // list all modules required for back-end rendering.
  module.exports = {
    './routes': Routes,
    './layout/Html': AdminHtml,
    './config': require('config')
  };
} else {
  if (window.Sentry) {
    window.Sentry.init({
      dsn: ENV_VARS.SENTRY_DSN,
      environment: ENV_VARS.SENTRY_ENVIRONMENT,
    });
  } else {
    console.error('Sentry client loading error'); // eslint-disable-line no-console
  }

  // front-end: init app.
  match({
    history: browserHistory,
    routes: Routes,
  }, (error, redirectLocation, renderProps) => {
    ReactDOM.hydrate(
      <Router { ...renderProps } />,
      document.querySelector('#app'),
    );

    is.appendBrowsers();
  });
}
