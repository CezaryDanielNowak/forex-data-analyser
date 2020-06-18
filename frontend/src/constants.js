import { BASE_PATH } from 'config';
import { enumPolyfill } from 'sf/helpers';

/* eslint-disable import/prefer-default-export */
export const ROUTES = enumPolyfill({
  INDEX: `${BASE_PATH}index.html`,
  CORRELATION_CHART: `${BASE_PATH}correlation.html`,
  DAY_BY_DAY: `${BASE_PATH}day-by-day.html`,
  AROUND_HOLIDAYS: `${BASE_PATH}around-holidays.html`,
  MULTI_SCROLLING: `${BASE_PATH}multi-scrolling.html`,

  NOT_FOUND: `${BASE_PATH}404.html`,

  CONTACT: `${BASE_PATH}contact.html`,
});
