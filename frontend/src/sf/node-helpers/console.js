const colors = require('colors');

module.exports = ({
  logError: (...args) => console.log(colors.red(...args)), // eslint-disable-line no-console
  logSuccess: (...args) => console.log(colors.green(...args)), // eslint-disable-line no-console
});
