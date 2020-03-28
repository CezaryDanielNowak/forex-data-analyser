module.exports = {
  description: 'Atom model',
  prompts: [{
    type: 'input',
    name: 'name',
    message: 'Model name:',
  }, {
    type: 'confirm',
    name: 'shared',
    message: 'Shared model?',
  }],
  actions: [{
    type: 'add',
    path: '../{{#if shared}}sf/{{/if}}models/{{name}}.js',
    templateFile: 'generators/model/model.hbs',
  }],
};
