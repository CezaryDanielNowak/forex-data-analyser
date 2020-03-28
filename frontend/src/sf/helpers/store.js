import isPlainObject from 'lodash/isPlainObject';
import omitBy from 'lodash/omitBy';
import is from 'next-is';

const set = (store, _set, storeConfig) => {
  return (field, value, attributes = {}) => {
    let valueToSave = value;
    if (isPlainObject(value)) {
      valueToSave = omitBy(valueToSave, (val) => {
        return is.string(val) && val.length >= storeConfig.quota;
      });
    }
    return _set.call(store, field, valueToSave, attributes);
  };
};

const stores = {
  // HACK: localStorage supports up to 5MB in Chrome, some browsers support 2MB
  // and some browsers can store different size each time (say hello to IE).
  // cookie can store up to 4000 bytes in Safari.
  // Disallow saving too-large strings silently when saving objects. This is
  // important because too-large property will prevent whole object from saving.
  // You can still try to save large object by passing string or array instead
  // of object.
  localStorage: {
    quota: 50000, // don't store longer strings in localStorage
    lib: require('store'),
    set,
  },
  // cookie fallback for Safari private browsing.
  // - please make sure to use only methods common for both: `store` and `js-cookie`
  // - please note: cookie can store up to 4KB data.
  //
  // This may not be needed anymore if this ticket is resolved:
  // https://github.com/marcuswestin/store.js/issues/156
  cookie: {
    quota: 1900,
    lib: require('js-cookie'),
    set,
    get: (store, _get) => {
      return (...args) => {
        const result = _get.apply(store, args);
        // js-cookie returns string instead of object
        return result && is.string.isJSON(result) ? JSON.parse(result) : result;
      };
    },
    clear: (store) => {
      return () => {
        const keys = store.get() || {};
        keys.forEach((key) => {
          try {
            store.remove(key);
          } catch (e) { /* empty */ }
        });
      };
    },
    remove: (store, _remove) => {
      return (key) => _remove.call(store, key, { path: '' });
    }
  },
};

Object.keys(stores).forEach((storeName) => {
  const store = stores[storeName];
  // monkey patching
  ['get', 'clear', 'remove', 'set'].forEach((key) => {
    if (store[key]) store.lib[key] = store[key](store.lib, store.lib[key], store);
  });
});

export const cookie = stores.cookie.lib;
export const localStorage = stores.localStorage.lib;

const defaultStore = is.browser() && !is.localStorageSupported()
  ? cookie
  : localStorage;

export default defaultStore;
