module.exports = {
  description: 'Page component',
  prompts: [{
    type: 'input',
    name: 'name',
    message: 'Page name:',
  }],
  actions: [{
    type: 'add',
    path: '../pages/{{name}}/{{name}}.js',
    templateFile: 'generators/page/page.hbs',
  }, {
    type: 'add',
    path: '../pages/{{name}}/{{name}}.scss',
    templateFile: 'generators/page/style.hbs',
  }, {
    type: 'add',
    path: '../pages/{{name}}/package.json',
    templateFile: 'generators/page/package.hbs',
  }],
};
