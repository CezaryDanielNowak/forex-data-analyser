import first from 'lodash/first';
import last from 'lodash/last';
import sf from 'sf';

import { mediator, sentryLog } from 'sf/helpers';
import { PROCESSING, UPLOADING } from 'sf/l10n';
import { HELP_DATA_FORM_VALIDATION_FAIL } from 'sf/messages';
import device from 'sf/models/device';

const superagent = global.superagent || require('superagent');

let authorizationConfiguration = {
  SAMPLE: {
    url: (method, url) => `${url}?SAMPLE_AUTHORIZATION_ADDON`,
    req: (method, url, req) => {
      req.set('Authorization', 'Token SAMPLE_AUTHORIZATION_ADDON');
    }
  },
};

/**
 * Sometimes backend provides backend URL, e.x:
 * `/backend/view/requested/d999d94a-9e99-4e77-b127-8a1030c131cc/`
 * We had to add `url.replace('backend/', '')` in many places, so that's why
 * getBackendUrl is needed.
 * NOTE: getBackendUrl will not work correctly if backend will be moved to any other location than
 *       /backend !
 */
export function getBackendUrl(url) {
  if (url.includes('://')) {
    return url;
  }
  if (url.includes('backend/')) {
    const { backendURL } = sf.getConfig();

    return `${backendURL}/${url.replace('backend/', '').replace(/^\//, '')}`;
  }
  return url;
}

/**
 * configureAuthorization updates request configuration.
 * It's used in case of shorthands like this:
 *   get('/backend/', 'SAMPLE');
 *
 * sample:
    configureAuthorization({
      SAMPLE: {
        url: (method, url) => `${url}?SAMPLE_AUTHORIZATION_ADDON`,
        req: (method, url, req) => {
          req.set('Authorization', 'Token SAMPLE_AUTHORIZATION_ADDON');
        }
      },
    });
 */
export const configureAuthorization = (cfg = {}) => {
  authorizationConfiguration = cfg;
};

/**
 * It's discouraged to use `request` function outside request helper.
 * Use rather get, post, del, patch, etc
 * @param  {String} method             method name, corresponding to superagent's name
 * @param  {String} url
 * @param  {String} authorizationMethod authorization method, configured
 *                                      by configureAuthorization
 * @return {Superagent's Request}
 */
export const request = (method, url, authorizationMethod) => {
  /**
   * Initialize request.
   * request('type', 'http://xxx/yyy', true) // attach Authorization ?registration_token=${user.get('token')}
   * request('type', 'http://xxx/yyy', 'SIGNUP') // attach Authorization token
   */
  const auth = getAuthorizationConfig(authorizationMethod);
  const computedURL = auth.url(method, getBackendUrl(url));

  const req = superagent[method](computedURL)
    .set('X-Requested-With', 'XMLHttpRequest') // jQuery convention
    .set('Accept', 'application/json');

  auth.req(method, url, req);
  return req;
};

export const postMultipart = (url, authorizationMethod) => {
  const auth = getAuthorizationConfig(authorizationMethod);
  const computedURL = auth.url('postMultipart', getBackendUrl(url));

  // type: form sets Content-Type: multipart/form-data
  const req = superagent
  // type: form sets Content-Type: application/x-www-form-urlencoded
    .post(computedURL)
    .set('Accept', 'application/json');

  req.on('progress', (e) => {
    if (Number.isFinite(e.percent) && e.percent < 100) {
      mediator.publish('GlobalLoader--setMessage', `${UPLOADING} ${parseInt(e.percent, 10)}%`);
    } else {
      mediator.publish('GlobalLoader--setMessage', PROCESSING);
    }

  });

  auth.req('postMultipart', url, req);

  return req;
};

export const [
  post,
  get,
  del,
  patch,
  head,
] = [
  'post',
  'get',
  'del',
  'patch',
  'head',
].map((method) => (url, authorizationMethod) => request(method, url, authorizationMethod));

export const endUserErrorHandler = (err, res) => {
  const errorTitle = res.statusCode === 400 ? 'Error:' : `Error: ${res.statusText}`;
  const errorText = res.body && (res.body.data || res.body.status_message) || res.body;
  // {"status_message":"Barcode not detected.","data":null}
  mediator.publish('showHelp', {
    theme: 'error',
    title: errorTitle,
    content: errorText
  });
};

/**
 * errorHandler is meant for generic errors, that are NOT handled by developer.
 * Most of the errors should be handled by endUserErrorHandler.
 */
export const errorHandler = (err, res) => {
  try {
    const message = res.body && (res.body.data || res.body.status_message);

    if (message) {
      const validation = res.body && res.body.data && res.body.data.validation;
      if (validation) {
        mediator.publish('showHelp', HELP_DATA_FORM_VALIDATION_FAIL({
          validation,
        }));
        return;
      }

      mediator.publish('showFloatingText', {
        text: message,
        isValid: false,
      });
    } else {
      throw new Error(res);
    }
  } catch (e) {
    mediator.publish('showFloatingText', {
      text: err.toString(),
      isValid: false,
    });
  }
};

const INVALID_RESPONSE_ERROR = {
  error_code: 'ERROR_CODE_NOT_PROVIDED_ERROR',
  status_message: '',
  data: {}
};

const OFFLINE_RESPONSE_ERROR = {
  ...INVALID_RESPONSE_ERROR,
  error_code: 'ERROR_NETWORK_OFFLINE',
};

/**
 * In some cases, backend does not return proper response.
 * Proper shape of `res.body` would be:
 * `{status_message: "Text not detected", data: {attempts_left: 1}, error_code: "REQUEST_INVALID"}`
 *
 *
 * @param  {Object} err
 * @param  {Object} _res
 * @return {Object}
 */
export const sanitizeResponse = (err, _res) => {
  const res = _res || {};
  const isOnLine = device.get('is.online');
  if (res.body == null) {
    res.body = {};
  }

  if (err) {
    if (typeof res.body === 'string') {
      res.body = { status_message: res.body };
    }

    res.body = {
      // iOS doesn't provide is.online. We rely on statusCode === -1.
      ...(!isOnLine || res.statusCode === -1) ? OFFLINE_RESPONSE_ERROR : INVALID_RESPONSE_ERROR,
      ...res.body,
    };
  }

  return res;
};

/**
 * extendedRequestEnd should be passed to superagentRequest.end function
 * It's main purpose is to handle requests and sanitaze response.
 *
 *
 * @param  {Function} resolve
 * @param  {Function} reject
 * @param  {Object} options   optional. Options
 * @param  {boolean} options.fullResponse   In case of a success, return everything,
 *                                          not only body.data.
 * @return {Function}         .end handler
 */
export const extendedRequestEnd = (resolve, reject, { fullResponse = false } = {}) => {
  return (err, _res) => {
    const res = sanitizeResponse(err, _res);
    const {
      error_code,
      status_message,
      data,
    } = res.body;

    const result = {
      res,
      data: data || {},
    };

    if (err) {
      reject({
        ...result,
        err,
        error_code,
        status_message: status_message || `${err}`,
        isCritical: res.statusCode >= 500 || res.statusCode <= 0,
      });
    } else {
      resolve(fullResponse ? result : data);
    }
  };
};
/**
 * It's async version of extendedRequestEnd with one difference:
 * - promise is never rejected.
 * This way it's possible and easy to write code like this:
 *   const { err, res } = await asyncExtendedRequestEnd(_err, _res);
 *
 * example:
 *   .end(async (_err, _res) => {
 *     const { err, error_code, data } = await asyncExtendedRequestEnd(_err, _res);
 *     if (err) {
 *       alert(`Sanitazed error code: ${error_code}`)
 *     } else {
 *       alert(`returned data: ${data}`);
 *     }
 *   })
 *
 * @param  {[type]} err  [description]
 * @param  {[type]} res [description]
 * @return {[type]}      [description]
 */
export const asyncExtendedRequestEnd = (err, res) => {
  return new Promise((resolve) => {
    const resolver = (data) => {
      resolve(data);
    };
    const rejector = (obj) => {
      if (obj.isCritical) {
        sentryLog(obj);
        console.error(obj); // eslint-disable-line no-console
      }
      resolve(obj);
    };

    extendedRequestEnd(resolver, rejector, { fullResponse: true })(err, res);
  });
};

export const attachMultipleFiles = (
  req,
  fieldName,
  fileArray,
  { fileNamePrefix = 'file' } = {},
) => {
  // TODO: check a data type of fileArray members
  fileArray.forEach((file, id) => {
    req.attach(fieldName, file.data, `${fileNamePrefix}${id}.${file.extension}`);
  });

  return req;
};

/**
 * Anti cache param is required for IE cache problem, when every get request is cached
 * Read more about the problem https://github.com/owncloud/core/issues/26922
 *
 * @param  {string} url
 * @return {string}
 */
export const antiCacheParam = (rawUrl, paramName = '__') => {
  const url = rawUrl.replace(/[?&]+$/g, ''); // sanitaze urls like `http://google.com/?&`
  const joinChar = url.includes('?') ? '&' : '?';

  return `${url}${joinChar}${paramName}=${Date.now()}`;
};

/**
 * plainGet bypass superagent and creates XMLHttpRequest.
 *
 * @param  {String} url
 * @return {Promise}
 */
export const plainGet = (url) => {
  const req = new XMLHttpRequest();

  const promise = new Promise((resolve, reject) => {
    req.open('GET', url, true);

    req.onload = () => {
      if (req.status >= 200 && req.status < 400) {
        resolve(req);
      } else {
        reject(req);
      }
    };

    req.onerror = reject;
    req.onabort = reject;

    req.send();
  });
  promise.rawRequest = req;

  return promise;
};


/* INTERNAL */

// Workaround for https://github.com/visionmedia/superagent/issues/1270
const tmpField = superagent.prototype.constructor.Request.prototype.field;
superagent.prototype.constructor.Request.prototype.field = function (name, val) {
  return tmpField.call(this, name, val == null ? '' : val);
};

/**
 * HACK: to inform front-end about XHR in progress, we have to hack superagent.
 *
 * @param  {Function} endCallback
 * @param  {Object}   options Options object
 * @param  {Object}   options.disableMediator Option to disable XHR topic to
 *                                            prevent spinner from showing up
 */
const _end = superagent.Request.prototype.end;
let openXHRCount = 0;
superagent.Request.prototype.end = function (endCallback, options = {}) {
  if (!options.disableMediator) {
    mediator.publish('XHR', ++openXHRCount);
  }

  const newEnd = function (err, res) {
    const body = { data: {} };
    if (!res) {
      /* eslint-disable */
      res = { body: body, text: {}, statusCode: -1 }; // Fix for connection errors
      /* eslint-enable */
    } else if (!res.body) {
      res.body = body;
    }

    if (!options.disableMediator) {
      mediator.publish('XHR', --openXHRCount);
      const error_code = res.body && res.body.error_code;
      if (error_code) {
        mediator.publish('requestHelper--error', error_code);
      }
    }

    return endCallback(err, res);
  };
  return _end.call(this, newEnd);
};

function getAuthorizationConfig(authorizationMethod) {
  const auth = authorizationConfiguration[authorizationMethod];

  if (!auth && authorizationMethod) {
    throw new Error(`${authorizationMethod} is not declared. Add it with 'configureAuthorization'`);
  }

  return auth || {
    url: (_, url) => url,
    req: (_1, _2, req) => req,
  };
}
