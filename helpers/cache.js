const config = require('../config');

const cache = {

};

module.exports = {
  getCache: function getCache(functionName, _args) {
    const args = Array.from(_args);
    const cacheField = `${functionName}-${args.map((arg) => `${arg}`).join('|')}`;
    if (cache[cacheField]) return cache[cacheField];
  },

  setCache: function setCache(functionName, _args, data) {
    const args = Array.from(_args);
    const cacheField = `${functionName}-${args.map((arg) => `${arg}`).join('|')}`;
    cache[cacheField] = data;

    setTimeout(() => {
      delete cache[cacheField];
    }, config.CACHE_TIMEOUT);
  }

}
