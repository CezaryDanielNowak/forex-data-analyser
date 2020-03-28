/* global __webpack_modules__ */

import SharedBaseComponent from 'sf/components/BaseComponent';
import noop from 'no-op';
import { browserHistory } from 'react-router';
import { BASE_PATH } from 'config';

// we assume, that redirection is performed within 120ms
// That mean, old components are unmounted, and new components are mounted.
const ESTIMATED_REDIRECTION_TIME = 120;

// HACK:
// This is a way to import module, just in case, when it's required by some other module.
// We don't want to reveal ADMIN_URL_PREFIX for non-admin app.js.
const adminConfig = {};
(__webpack_modules__[require.resolveWeak('apps/admin/config')] || noop)({}, adminConfig);
const { ADMIN_URL_PREFIX } = adminConfig.default || {};

export default class BaseComponent extends SharedBaseComponent {
  navigate(url, method = 'push') {
    return new Promise((resolve) => {
      let finalUrl = url;
      if (!finalUrl.includes('//') && !finalUrl.startsWith('/')) {
        finalUrl = `${BASE_PATH}${finalUrl.replace(/^\//, '')}`;
      }
      browserHistory[method](finalUrl);
      setTimeout(resolve, ESTIMATED_REDIRECTION_TIME);
    });
  }

  adminNavigate(url) {
    return this.navigate(`${ADMIN_URL_PREFIX}${url}`, 'push');
  }
}
