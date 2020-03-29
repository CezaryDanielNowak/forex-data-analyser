'use strict';

/* eslint-disable no-console */
const colors = require('colors');
const config = require('../../../config');
const express = require('express');
const os = require('os');
const serverRendering = require('./server-rendering.js');
const timeout = require('connect-timeout');
const first = require('lodash/first');
const { getAllRoutes } = require('./server-rendering');

const app = express();

function getLocalIpAddresses() {
  const netInterfaces = os.networkInterfaces();
  const addresses = [];
  Object.keys(netInterfaces).forEach((netInterface) => {
    // omit virtual interfaces.
    if (netInterface.includes('VMware') || netInterface.includes('vboxnet')) return;

    netInterfaces[netInterface].forEach((netAddrObj) => {
      if (netAddrObj.family === 'IPv4') {
        addresses.push(netAddrObj.address);
      }
    });
  });
  return addresses;
}

function getLangFromUrl(originalUrl) {
  const languageMatch = originalUrl
    .match(getLangFromUrl.langRegexp);

  return languageMatch
    ? languageMatch[1]
    : first(config.LANGUAGES);
}
getLangFromUrl.langRegexp = new RegExp(`\\/(${config.LANGUAGES.join('|')})\\/`);

function getBundleNameFromReq(req) {
  const lang = getLangFromUrl(req.originalUrl);

  const urlToMatch = req.path.replace(getLangFromUrl.langRegexp, '/');
  const appKeys = config.SF_WEBPACK_ENTRIES
    ? Object.keys(config.SF_WEBPACK_ENTRIES)
    : ['app'];

  let appKey;

  if (appKeys.length > 1) {
    appKey = appKeys
      .find((key) => {
        return getAllRoutes(`${key}-${lang}.js`)
          .find((route) => route === urlToMatch);
      });
  }

  return `${appKey || 'app'}-${lang}.js`;
}

const serverRenderingHandler = (bundleName, req, res, next) => {
  serverRendering
    .generateMarkup(req.url, bundleName)
    .then((statusObj) => {
      if (statusObj.redirect) {
        res.redirect(301, statusObj.redirect.pathname + statusObj.redirect.search);
      } else if (statusObj.error) {
        console.log(statusObj.error);
        next(statusObj.error);
      } else {
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.send(statusObj.data);
      }
    });
};

module.exports = () => {
  function serverTask() {
    /*
     * Disable cache for easier debug
     */
    if (config.ENV === 'local') {
      app.get('/*', (req, res, next) => {
        if (req.url.match(/\.(jpg|png|gif|otf|eot|ttf)$/)) {
          // cache images and fonts
          return next();
        }
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Expires', '-1');
        res.setHeader('Pragma', 'no-cache');
        next();
      });
      app.disable('etag');
    }

    /*
     * Set timeout for long-running requests.
     */
    app.use(timeout(config.DEFAULT_REQUEST_TIMEOUT));

    app.use(haltOnTimeout);

    if (config.ENV === 'local' && config.DEBUG_PROXY_BACKEND_URL) {
      const APICacheProxy = require('node-api-cache-proxy');

      // FIX for invalid dev/staging truststamp certificate:
      // UNABLE_TO_VERIFY_LEAF_SIGNATURE
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

      const apiCacheProxy = new APICacheProxy({
        cacheEnabled: false,
        apiUrl: config.DEBUG_PROXY_BACKEND_URL,
      });

      app.use('/backend', apiCacheProxy);
    }

    /*
     * serve all static files from assets/brand-XYZ directory.
     */
    if (config.ENV === 'local') {
      app.use(express.static(`${config.ASSETS_DIR}/brand-${config.BRAND_NAME}`, {
        dotfiles: 'ignore',
        maxAge: '8h',
      }));

      app.use(haltOnTimeout);
    }

    /*
     * serve all static files from dist/ directory.
     */
    app.use(express.static(config.DESTINATION_DIR, {
      dotfiles: 'ignore',
      index: 'index.html',
      maxAge: '8h',
    }));

    app.use(haltOnTimeout);

    /*
     * serve all static files from assets/ directory.
     */
    if (config.ENV === 'local') {
      app.use(express.static(config.ASSETS_DIR, {
        dotfiles: 'ignore',
        maxAge: '8h',
      }));

      app.use(haltOnTimeout);
    }

    /*
     * server-side rendering for react components.
     */
    app.use((req, res, next) => {
      const bundleName = getBundleNameFromReq(req);

      serverRenderingHandler(bundleName, req, res, next);
    });

    app.use(haltOnTimeout);

    // TODO: Error-page handling.

    /*
     * start server
     */
    const serverStartedCallback = () => {
      const printAddr = (addr) => {
        return `http${config.HTTPS_DEBUG ? 's' : ''}://${addr}:${config.SERVER_PORT}`;
      };

      let serverStartedMsg = `-------------------
SERVER STARTED
Go to ${printAddr(config.SERVER_HOST)}`;

      if (config.SERVER_HOST === '0.0.0.0') {
        serverStartedMsg += '\nDetected network address:';
        getLocalIpAddresses().forEach((addr) => {
          serverStartedMsg += `\n${printAddr(addr)}`;
        });
      }

      serverStartedMsg += '\n-------------------';

      console.log(colors.green(serverStartedMsg));
    };
    if (config.HTTPS_DEBUG) {
      const https = require('https');
      const fs = require('fs');

      const options = {
        key: fs.readFileSync(`${config.BASE_DIR}/server.key`),
        cert: fs.readFileSync(`${config.BASE_DIR}/server.crt`),
        requestCert: false,
        rejectUnauthorized: false,
      };

      https
        .createServer(options, app)
        .listen(config.SERVER_PORT, serverStartedCallback);
    } else {
      app.listen({
        host: config.SERVER_HOST,
        port: config.SERVER_PORT,
      }, serverStartedCallback);
    }
  }

  return serverTask;
};

function haltOnTimeout(req, res, next) {
  if (!req.timedout) next();
}
