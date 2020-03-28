const componentGenerator = require('./generators/component/index.js');
const modelGenerator = require('./generators/model/index.js');
const pageGenerator = require('./generators/page/index.js');

module.exports = (plop) => {
  plop.setGenerator('component', componentGenerator);
  plop.setGenerator('model', modelGenerator);
  plop.setGenerator('page', pageGenerator);
};
