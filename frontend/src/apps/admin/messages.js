/* eslint-disable max-len */
import React from 'react';

export const ADMIN_HELP_DATA_PASSWORD_CHANGED = () => ({
  title: 'Password',
  content: 'Your password is changed',
});

export const ADMIN_HELP_CANT_GET_CUSTOMER_DATA = () => ({
  theme: 'error',
  content: 'Cannot load customer data. Please try again.',
});

export const ADMIN_HELP_CANT_GET_ASSET = () => ({
  theme: 'error',
  content: 'Cannot load an asset. Please try again.',
});

export const ADMIN_HELP_INVALID_CUSTOMER_ID = () => ({
  theme: 'error',
  content: 'Invalid user id',
});

export const ADMIN_HELP_PIN_DISABLED_CONFIRMATION = () => ({
  content: 'Pin disabled',
});

export const ADMIN_HELP_UNLOCK_CUSTOMER_CONFIRMATION = () => ({
  content: [
    <p>Authorization process unlocked</p>,
    <p>User can now start registration again</p>
  ],
});

export const ADMIN_HELP_UNLOCK_CUSTOMER_ERROR = () => ({
  theme: 'error',
  content: <p>Cannot unlock authorization process</p>,
});

export const ADMIN_HELP_PASSWORD_EXPIRED = () => ({
  content: 'Your password expired and must be changed. Set a new password.',
});

export const SSO_LOGIN_FAILED_GENERIC = () => ({
  title: 'SSO Login failed',
  content: 'Unable to login with Single-Sign-On. Please try again.',
});

export const SSO_LOGIN_TOKEN_COULD_NOT_LOAD = () => ({
  title: 'SSO Login failed',
  content: 'Unable to login with Single-Sign-On. Token might be expired.',
});

export const SSO_SYF_NOT_AUTHENTICATED = () => ({
  title: 'SSO Login failed',
  content: 'Authentication was rejected.',
});

export const SSO_LOGIN_TOKEN_NOT_SAVED = () => ({
  title: 'SSO Login failed',
  content: 'Your token was not saved. Please make sure, your browser does not clear session storage automatically.',
});

export const ADMIN_HELP_BLACKLIST_REMOVE_ERROR = () => ({
  theme: 'error',
  content: <p>Cannot remove user from the negative list.</p>,
});
export const ADMIN_HELP_BLACKLIST_ADD_ERROR = () => ({
  theme: 'error',
  content: <p>Cannot add user to the negative list.</p>,
});

const ERROR_CODE_TO_HELP_DATA = {
  SYF_NOT_AUTHENTICATED: SSO_SYF_NOT_AUTHENTICATED,
};
/* eslint-enable max-len */

// eslint-disable-next-line no-unused-vars
export const errorCodeToHelpData = ({ error_code, error_msg }, service = 'unknown') => {
  let helpData = ERROR_CODE_TO_HELP_DATA[error_code];

  if (!helpData && error_msg) {
    // sso login has two possible error codes: backend one and SSO one.
    // In case of SSO error, error_msg field is used to store SSO errors.
    // SSO errors are comma-separated
    const error_msgs = error_msg.split(',');

    while (!helpData && error_msgs.length) {
      helpData = ERROR_CODE_TO_HELP_DATA[error_msgs.pop()];
    }
  }

  return helpData;
};
