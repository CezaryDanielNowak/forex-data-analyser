module.exports = {
  description: 'Component',
  prompts: [{
    type: 'input',
    name: 'name',
    message: 'Component name:',
  }, {
    type: 'confirm',
    name: 'shared',
    message: 'Shared Component?',
  }],
  actions: [{
    type: 'add',
    path: '../{{#if shared}}sf/{{/if}}components/{{name}}/{{name}}.js',
    templateFile: 'generators/component/component.hbs',
  }, {
    type: 'add',
    path: '../{{#if shared}}sf/{{/if}}components/{{name}}/{{name}}.test.js',
    templateFile: 'generators/component/test.hbs',
  }, {
    type: 'add',
    path: '../{{#if shared}}sf/{{/if}}components/{{name}}/{{name}}.scss',
    templateFile: 'generators/component/style.hbs',
  }, {
    type: 'add',
    path: '../{{#if shared}}sf/{{/if}}components/{{name}}/package.json',
    templateFile: 'generators/component/package.hbs',
  }],
};
