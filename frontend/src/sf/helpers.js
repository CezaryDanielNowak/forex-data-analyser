// WARNING:
// Before writing your own helper, make sure if there is no available one on
// npm registry.

/* global FRONTEND_URL */

import React from 'react';
import param from 'jquery-param';
import camelCase from 'lodash/camelCase';
import _get from 'lodash/get';
import kebabCase from 'lodash/kebabCase';
import last from 'lodash/last';
import pick from 'lodash/pick';
import pickBy from 'lodash/pickBy';
import Mediator from 'mediator-js/lib/mediator';
import is from 'next-is';
import randomString from 'randomstring';
import { browserHistory } from 'react-router';

import { createAndClickAnchor } from 'sf/helpers/domHelper';
import { YEAR } from 'sf/helpers/date';

export const mediator = is.isFunction(Mediator) ?
  new Mediator() :
  new Mediator.Mediator();
// We need a method for the request chaining to make it possible to test args
export const testSpy = (args) => args;

/**
 * Converts query stringing into object
 * @param  {string} input  "?xxx=yyy&aaa=bbb" or "#xxx=yyy&aaa=bbb"
 * @return {object}        { xxx: 'yyy', aaa: 'bbb' }
 */
export const getQuery = (input = typeof location !== 'undefined' ? location.search : '') => {
  const result = {};
  if (input.length > 2) {
    const queryArr = input.substr(1).split('&');
    for (let i = 0, len = queryArr.length; i < len; ++i) {
      const pair = queryArr[i].split('=');
      if (pair.length) {
        result[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
      }
    }
  }
  return result;
};

/**
 * Builds query from the object
 * @param  {string} inputObject  { xxx: 'yyy', aaa: 'bbb' }
 * @return {string}              "xxx=yyy&aaa=bbb" or "#xxx=yyy&aaa=bbb"
 */
export const buildQuery = (inputObject) => {
  /* istanbul ignore next */
  return is.browser() ? param(inputObject, true) : '';
};

/**
 * cacheParam helper adds cache param to the URL.
 */
export const cacheParam = (url) => {
  return `${url}?_=${CACHE_PARAM}`;
};

export const asset = (...args) => {
  let result = typeof args[0] === 'string' && arguments.length === 1 ?
    args[0] :
    String.raw(...args);

  if (result[0] === '/') {
    result = result.substr(1);
  }

  const prefix = /^http/i.test(result) ? '' : ASSETS_URL;

  return cacheParam(`${prefix}${result}`);
};

export const generateToken = (tokenLength) => {
  // checking for window because randomstring has bug that hangs node forever.
  return is.browser() ?
    randomString.generate(tokenLength) : '00000000';
};

export const getLocaleDateString = (date, locale) => {
  const formatGB = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  const formatUS = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;

  const formattedDate = {
    'en-AU': formatGB,
    'en-CA': formatUS,
    'en-GB': formatGB,
    'en-IN': formatUS,
    'en-NZ': formatGB,
    'en-US': formatUS,
    'es-MX': formatGB,
  };

  return formattedDate[locale] || formattedDate['en-US'];
};

export const getDate = (timestamp) => {
  if (!timestamp) return null;
  // Avoid timezone conversion by using the constructor of Date(year, month, day)
  // for timestamp of yyyy-mm-dd, which applies zero UTC offset
  const match = timestamp.match(/(\d{4})-(\d{2})-(\d{2})/);
  let date;
  if (match) {
    const [, year, month, day] = match;
    date = new Date(year, month - 1, day);
  } else {
    date = new Date(timestamp);
  }
  return isNaN(1 * date) ? '  /  /    ' : getLocaleDateString(date, 'en-US');
};

/**
 * Takes encoded image, and returns format acceptable by mediator.attach
 * @param  {string} dataURI
 * @return {Object}          sample: { data: [object Blob], extension: 'png' }
 */
export const dataURItoImage = (...args) => {
  // eslint-disable-next-line no-console
  console.warn('dataURItoImage was moved to sf/helpers/canvas');
  return require('sf/helpers/canvas').dataURItoImage(...args);
};

export const getHumanReadableTimeDiff = (fromDate, toDate = new Date()) => {
  if (!fromDate) throw new Error('First argument should be a date!');
  if (isNaN(Date.parse(fromDate))) throw new Error('The first date is not valid!');
  const timeDiff = Math.abs(toDate.getTime() - new Date(fromDate).getTime());
  const diffInMonths = Math.ceil(timeDiff / (1000 * 3600 * 24 * 30));
  if (isNaN(diffInMonths)) throw new Error('The second date is not valid!');
  if (diffInMonths > 23) {
    return `${Math.round(diffInMonths / 12)} years`;
  } else if (diffInMonths > 11) {
    return '1 year';
  } else if (diffInMonths === 1) {
    return '1 month';
  }
  return `${diffInMonths} months`;
};

export const pascalCase = (str) => {
  return `${camelCase(str).substr(0, 1).toUpperCase()}${camelCase(str).substr(1)}`;
};

/**
 * Prepare symbols dictionary from the array or arguments list.
 * from
 *   symbols('A', 'B', 'C')
 * to
 *   {
 *     A: 'A',
 *     B: 'B',
 *     C: 'C'
 *   }
 * @param  {...[String] or Array} args
 * @return {Object}
 */
export const symbols = function (...args) {
  const arr = args.length > 1 ? args : args[0];
  return arr.reduce((result, val) => {
    result[val] = val;
    return result;
  }, {});
};

export const formatPhone = (phone) => {
  const phoneParts = phone.split('-');
  return `+1 (${phoneParts[0]}) ${phoneParts[1]}-${phoneParts[2]}`;
};

// Hack for cases when few pages uses the same component. Some components does not support
// componentWillReceiveProps that causes weird behaviour on navigation.
export const cloneClass = (Proto) => {
  return class DynamicClass extends Proto {};
};

const loadScriptPoolCache = {};
/**
 * loadScriptPool is used for scripts, that does not have `onLoad` callback properly
 * implemented. It's also used when we're to lazy to read whole documentation for
 * every third party lib.
 * This helper returns the same Promise all the time, so it's safe to call
 * loadScriptPool() multiple times.
 *
 * @param  {string} scriptName Script name to check global[scriptName].
 *                             scriptName can be complex structure like 'obj.arr[12]'
 * @param  {Function} loadCode   Function that will be called once to trigger loading
 * @return {Promise} Promise object
 */
export const loadScriptPool = /* istanbul ignore next */ (scriptName, loadCode) => {
  if (!loadScriptPoolCache[scriptName]) {
    loadCode();

    let interval;
    loadScriptPoolCache[scriptName] = new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        // script didn't load after 90 seconds - trigger failure.
        console.error(`${scriptName} couldn't be loaded after 90 seconds.`); // eslint-disable-line
        clearInterval(interval);
        reject();
      }, 90000);
      interval = setInterval(() => { // eslint-disable-line prefer-const
        const obj = _get(global, scriptName);
        if (obj) {
          if (ENV === 'local') {
            console.info(`${scriptName} loaded by loadScriptPool.`); // eslint-disable-line
          }
          clearInterval(interval);
          clearTimeout(timeout);
          resolve(obj);
        }
      }, 333);
    });
  }

  return loadScriptPoolCache[scriptName];
};

const cssCache = {};

export const loadCssFile = (url) => {
  if (cssCache[url]) return;
  const link = document.createElement('link');
  cssCache[url] = link;
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = url;
  document.body.appendChild(link);
  return link;
};

/**
 * getClassNamesFromProps is used to extract class names given the Components'
 * props and a set of allowed classes
 *
 * @param  {Object} props the Components' props
 * @param  {Object} allowedClasses set of allowed classes
 * @return {Object} an object of classes to pass to `this.cn` or `this.rootcn` method
 */
export const getClassNamesFromProps = (props, allowedClasses) => Object.keys(
  pick(props, allowedClasses)
)
  .map((className) => kebabCase(className))
  .reduce((acc, curr) => {
    acc[`--${curr}`] = true;
    return acc;
  }, {});

export const snakeCase = (text) => kebabCase(text).replace(/-/g, '_');

export const ageToDate = (age) => {
  if (!age) throw new Error('No age supplied!');
  if (!Number.isFinite(age)) throw new Error('Age is not a number!');
  /* eslint-enable */
  const currentEpoch = new Date().getTime();
  const maxEpoch = currentEpoch - age * YEAR;
  const maxDate = new Date(maxEpoch);
  return [
    maxDate.getUTCFullYear(),
    `0${maxDate.getUTCMonth() + 1}`.substr(-2),
    `0${maxDate.getUTCDate()}`.substr(-2),
  ].join('-');
};

export const navigate = (url, method = 'push') => new Promise((resolve) => {
  mediator.publish('router:navigate', url);
  browserHistory[method](url);

  // TODO: We assume redirection is done after 120ms.
  //       Refactor it to handle proper navigation events.
  setTimeout(resolve, 120);
});

export const capitalise = (str) => str && `${
  str.trim().substr(0, 1).toUpperCase()
}${
  str.trim().substr(1).toLowerCase()
}`;

export const sentenceCase = (str) => (str || '')
  .split('.')
  .map(capitalise)
  .join('. ');

export const upperCase = (str) => (str || '').toUpperCase();

export const wordUpperCase = (str) => (str || '')
  .split(' ')
  .map((word) => word.toLowerCase())
  .map((word) => ['of', 'and'].includes(word) ?
    word :
    capitalise(word))
  .join(' ');

export const getFileFromBlob = ({ text, extension, name, type }) => {
  const URL = window.webkitURL || window.URL;

  const file = new Blob([text], { type });
  const fileName = `${name}.${extension}`;

  // IE11
  if (navigator.msSaveOrOpenBlob) {
    navigator.msSaveOrOpenBlob(file, fileName);
  } else {
    // TODO: revoke url as described here
    //       https://github.com/nusmodifications/nusmods/pull/575/files
    const downloadUrl = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = downloadUrl;

    // iOS, it doesn't support download and can't have the target
    if (a.download !== undefined) {
      a.download = fileName;
      if (!a.dataset) {
        a.dataset = {};
      }
      a.dataset.downloadurl = [type, a.download, a.href].join(':');
    }
    createAndClickAnchor(a);
  }
};

export const getFileFromUrl = ({ url, target = '_self' }) => {
  const a = document.createElement('a');
  a.href = url;
  a.target = target;
  createAndClickAnchor(a);
};

export const downloadFileFromUrl = (url) => {
  const a = document.createElement('a');
  a.href = url;

  if (a.download !== undefined) {
    a.download = last(url.split('/'));
    if (!a.dataset) {
      a.dataset = {};
    }
    a.dataset.downloadUrl = ['', a.download, a.href].join(':');
  }
  createAndClickAnchor(a);
};

export const isPromise = (...args) => {
  if (ENV === 'local') {
    // eslint-disable-next-line no-console, max-len
    console.log('WARN: Please use is.isPromise instead of helpers.isPromise. This function will be removed in 2019.');
  }
  return is.isPromise(...args);
};

export const hexToRGB = (hex, alpha = 1) => {
  if (/^#(?:[0-9a-f]{3}){1,2}$/i.test(hex)) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
};

export const domainify = (string = '') => string
  .replace(/[^a-zA-Z0-9]+/gi, ' ')
  .trim()
  .replace(/\s/gi, '-')
  .toLowerCase();

/* eslint-disable no-nested-ternary */
export const ensureChildValidity = (child) => React.isValidElement(child) ?
  child :
  child.toString ?
    child.toString() :
    String(child);

/* eslint-enable */

export const isValidNumber = (candidate) => candidate !== '' &&
  (
    Number.isFinite(Number(candidate)) ||
    Math.abs(candidate) === Infinity
  );

/**
 * Works similar to _.pick but takes Strings and RegExps
 * as second argument.
 *
 * sample usage:
 * advancedPick({ 'data-test': 1, a: 2, b: 3 }, [/^data-/, 'b'])
 *   // --> { 'data-test': 1, b: 3 }
 *
 *
 * @param  {Object} obj   Object to pick from
 * @param  {Array} paths  Array of Strings and RegExps
 * @return {Object}
 */
export const advancedPick = (obj, paths) => pickBy(
  obj, (value, name) => paths.some(
    (pathOrRegexp) => pathOrRegexp instanceof RegExp
      ? pathOrRegexp.test(name)
      : pathOrRegexp === name
  )
);

export const sentryLog = (error, extra) => {
  console.error('ERROR LOGGED TO SENTRY:', error); // eslint-disable-line no-console
  const Sentry = global.Raven || global.Sentry;

  if (Sentry) { // log it to sentry
    if (extra) {
      Sentry.setExtra('errorDetails', extra);
    }

    // eslint-disable-next-line max-len
    Sentry[typeof error === 'string' ? 'captureMessage' : 'captureException'](error);
    setTimeout(() => {
      Sentry.setExtra('errorDetails', null);
    }, 125);
  } else {
    console.error('ERROR: Sentry is not working.', error); // eslint-disable-line no-console
  }
};

export const sleep = (timeout) => new Promise((resolve) => setTimeout(resolve, timeout));

/**
 * get value of every ref (potentially ValidationInput, Select etc)
 * returned as an object. This should be easly used with validation.
 */
export const getRefValues = (that, prefix = 'form') => {
  const regexp = new RegExp(`^${prefix.replace('.', '\\.')}`);
  return Object.keys(that.refs).reduce((result, key) => {
    if (regexp.test(key)) { // use only refs starting with [prefix]
      result[key.replace(regexp, '')] = that.refs[key].value;
    }
    return result;
  }, {});
};

/**
 * enum function mimics TypeScript's Enum type.
 * the main feature of this is to throw an Error, when you're accessing a
 * object member, that was not declared before.
 *
 * example:
    const ROUTES = enumPolyfill({
      CONTACT: '/contact-us.html',
      HELP: /help.html',
    }, handler);

    navigate(ROUTES.ABOUT_US); // throws an error: `ABOUT_US` is not a member of an object!
 *
 *
 * TODO: replace all enumPolyfill cals with real enum, if migrate to TS.
 * NOTE: This won't work on IE, but also won't break IE.
 *
 * @param {Object} obj
 * @return {Object}
 */
export const enumPolyfill = (object) => {
  const PolyfilledProxy = global.Proxy
    ? global.Proxy
    : (obj) => obj;

  return new PolyfilledProxy(object, {
    get: (obj, prop) => {
      if (!(prop in obj)) throw new Error(`${prop} is not a member of an object!`);
      return obj[prop];
    }
  });
};
