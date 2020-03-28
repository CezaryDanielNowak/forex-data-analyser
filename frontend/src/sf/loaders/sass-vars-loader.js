const parse = require('parse-sass-value');

module.exports = function (content) {
  return [
    ...Object
      .entries(this.options.sassVars)
      .filter(([, value]) => value)
      .map(([prop, value]) => `$${prop}: ${parse(value)};`),
    content,
  ].join('\n');
};
