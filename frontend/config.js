'use strict';

const argv = require('minimist')(process.argv.slice(2));
const path = require('path');

const config = {
  HTTPS_DEBUG: false,
  CACHE_PARAM: Date.now().toString(36),
  SHARED_FRONTEND_DIR: path.resolve(__dirname, 'src/sf'),
  // MULTIPART_DEBUG: save all `multipart/form-data` - use it to debug videos and photos.
  // This works only whit BACKEND_URL: '',
  MULTIPART_DEBUG: false,
  // When having trouble with local backend, and you're really frustrated.
  // How to use:
  // - set `BACKEND_URL: '/backend'` in config.local.js
  // - set `DEBUG_PROXY_BACKEND_URL: 'https://sample.com/backend'` in config.local
  // This work on ENV==local only
  DEBUG_PROXY_BACKEND_URL: false,
  DEBUG_BUNDLE_ANALYZE: false,
  DEFAULT_REQUEST_TIMEOUT: 60000, // ms
  enableSourceMapsJS: true,

  BASE_DIR: __dirname,
  ASSETS_DIR: path.resolve(__dirname, 'assets'),
  SOURCE_DIR: path.resolve(__dirname, 'src'),
  DESTINATION_DIR: path.resolve(__dirname, '../', 'dist'),
  ENV: argv.env || 'local',
  BRAND_NAME: argv.brand || 'default',
  TEST_RUNNER: argv.test_runner || false,
  SERVER_PORT: argv.port || 3002,
  SERVER_HOST: '0.0.0.0',
  // YEAR_CONF is here, so we don't have update year in footer etc every January.
  YEAR_CONF: new Date().getUTCFullYear(),
  TOKEN_LENGTH: 32,
  DEFAULT_PAGE_TITLE: 'The Hays App',
  BACKEND_URL: '',
  ASSETS_URL: '/',

  IS_WATCH: process.argv[2] === 'watch', // gulp watch

  // LANGUAGES
  // - webpack generates app-{LANGUAGE}.js
  // - it's passed to <html lang="{LANGUAGE}">
  // - it's passed to google's `hl=` param, possible values listed here:
  //   https://developers.google.com/recaptcha/docs/language
  LANGUAGES: ['en'],

  SF_WEBPACK_ENTRIES: {
    app: path.resolve(__dirname, 'src/app.js'),
//    admin: path.resolve(__dirname, 'src/apps/admin/app.js'),
  },
};

let localConfig;
try {
  // require used instead of import, to prevent build errors
  localConfig = require(`./config.${config.ENV}`);
} catch (e) {
  localConfig = {};
}

module.exports = Object.assign(config, localConfig);
