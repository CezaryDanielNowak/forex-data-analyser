import { BASE_PATH } from 'config';
import { enumPolyfill } from 'sf/helpers';

/* eslint-disable import/prefer-default-export */
export const ROUTES = enumPolyfill({
  INDEX: `${BASE_PATH}index.html`,
  BASIC_INFO: `${BASE_PATH}basic-info.html`,
  RESULTS: `${BASE_PATH}results.html`,
  RESULTS_FAILED: `${BASE_PATH}verify-failed.html`,
  RESULTS_SUCCESS: `${BASE_PATH}verify-success.html`,
  TERMS_OF_USE: `${BASE_PATH}terms-of-use.html`,
  NOT_FOUND: `${BASE_PATH}404.html`,

  VIDEO_RECORDING_TUTORIAL: `${BASE_PATH}video-tutorial.html`,
  LOG_IN: `${BASE_PATH}log-in.html`,
  VIDEO_PROCESSING: `${BASE_PATH}video-processing.html`,
  HASH_PAGE: `${BASE_PATH}hash.html`,
  USER_PAGE: `${BASE_PATH}user-page.html`,
});
