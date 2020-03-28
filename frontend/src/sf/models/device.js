import { addEventListener, getWindowHeight, getWindowWidth } from 'sf/helpers/domHelper';
import atom from 'atom-js';
import is from 'next-is';

const config = {
  xxxsm_breakpoint: 320,
  xxsm_breakpoint: 460,
  xsm_breakpoint: 768,
  sm_breakpoint: 880,
  md_breakpoint: 1000,
  lg_breakpoint: 1200,
  xlg_breakpoint: 1480,
  xxlg_breakpoint: 1680,
};

const deviceHelper = {
  /**
   * Check if window width resolves selector from _media-queries.scss
   */
  xxxsmDown: function () { return getWindowWidth() <= config.xxxsm_breakpoint - 1; },
  xxsmDown: function () { return getWindowWidth() <= config.xxsm_breakpoint - 1; },
  xsmDown: function () { return getWindowWidth() <= config.xsm_breakpoint - 1; },
  smDown: function () { return getWindowWidth() <= config.sm_breakpoint - 1; },
  mdDown: function () { return getWindowWidth() <= config.md_breakpoint - 1; },
  lgDown: function () { return getWindowWidth() <= config.lg_breakpoint - 1; },
  xlgDown: function () { return getWindowWidth() <= config.xlg_breakpoint - 1; },

  xxxsmUp: function () { return getWindowWidth() >= config.xxxsm_breakpoint; },
  xxsmUp: function () { return getWindowWidth() >= config.xxsm_breakpoint; },
  xsmUp: function () { return getWindowWidth() >= config.xsm_breakpoint; },
  smUp: function () { return getWindowWidth() >= config.sm_breakpoint; },
  mdUp: function () { return getWindowWidth() >= config.md_breakpoint; },
  lgUp: function () { return getWindowWidth() >= config.lg_breakpoint; },
  xlgUp: function () { return getWindowWidth() >= config.xlg_breakpoint; },

  windowWidth: function () { return getWindowWidth(); },
  windowHeight: function () { return getWindowHeight(); },
};

const nextISState = [
  'android',
  'browser',
  'desktop',
  'firefox',
  'ie',
  'ie11',
  'iOS',
  'iOS10',
  'iOS11',
  'iOS12',
  'iOS9',
  'localStorageSupported',
  'mac',
  'mobile',
  'opera',
  'safari',
  'thirdPartyIOSBrowser',
  'userMediaSupported',
  'windows',
];

if (!is.browser()) {
  /**
   * SSR HANDLING
   */
  const sayNO = function () { return false; };
  Object.keys(deviceHelper).forEach((helperName) => {
    deviceHelper[helperName] = sayNO;
  });
}

function getDeviceState() {
  const result = {};
  Object.keys(deviceHelper).forEach((helperName) => {
    result[helperName] = deviceHelper[helperName]();
  });

  nextISState.forEach((key) => {
    result[`is.${key}`] = is[key]();
  });

  return result;
}

const model = atom(getDeviceState());

if (is.browser()) {
  /**
   * in browser environment every resize event will trigger
   * model update.
   */
  addEventListener(window, 'resize', () => {
    model.set(getDeviceState());
  });

  addEventListener(window, 'online', () => {
    model.set({
      'is.online': true,
      'is.offline': false,
    });
  });

  addEventListener(window, 'offline', () => {
    model.set({
      'is.online': false,
      'is.offline': true,
    });
  });

  model.set({
    'is.online': navigator.onLine,
    'is.offline': !navigator.onLine
  });
}

Object.assign(model, deviceHelper);

/**
 * Update default `device` helper config with project specific.
 *
 * @param  {[type]} configObj object to extend `config`
 */
model.configure = (configObj) => {
  Object.keys(configObj).forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(config, key)) {
      config[key] = configObj[key];
    } else {
      throw new Error(`device.configure error - "${key}" key invalid`);
    }
  });
};

export default model;
