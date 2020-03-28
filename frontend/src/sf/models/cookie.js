import atom from 'atom-js';
import is from 'next-is';
import store from 'sf/helpers/store';

const modelName = 'cookieModel';

const model = atom.setup({
  modelName: modelName,
  persistenceLib: store,
  validation: {
    areCookiesAccepted: {
      'This variable should be boolean': is.isBoolean,
    },
  },
})(store.get(modelName) || {
  areCookiesAccepted: false,
});

export default model;
