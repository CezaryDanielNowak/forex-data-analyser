// NOTE: import `sf` as your first dependency, so polyfills are loaded

require('./polyfills/required');

const config = {
  SpinnerComponent: null, // pass custom `SpinnerComponent` to replace sf/components/Spinner
  assetsURL: '', // URL for assets. CDN or application path
  backendURL: '',
};

module.exports = {
  getConfig: (key) => key === undefined ? config : config[key],
  configure: (newConfig) => {
    Object.assign(config, newConfig);
  },
};
