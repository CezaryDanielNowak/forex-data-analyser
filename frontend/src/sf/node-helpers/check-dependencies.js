/* eslint-disable */

/*
  how to use:
  node check-dependencies.js
 */

const proj = require('../../../package.json');
const sf = require('../package.json');

const depsToRemove = {
  dependencies: [],
  devDependencies: [],
};

const checkDependencies = (field) => Object.keys(proj[field])
  .reduce((result, key) => {
    if (sf.dependencies[key]) {
      let removedField = `${key}@${proj[field][key]}`;
      if (proj[field][key] !== sf.dependencies[key]) {
        removedField += ` (sf: ${sf.dependencies[key]})`;
      }
      depsToRemove[field].push(removedField);
    } else {
      result[key] = proj[field][key];
    }

    return result;
  }, {});


const newDeps = checkDependencies('dependencies');
const newDevDeps = checkDependencies('devDependencies');

console.log('dependencies to remove:');
console.log(depsToRemove.dependencies.join('\n') || '-none-');
console.log('\n  ---\n\ndevDependencies to remove:');
console.log(depsToRemove.devDependencies.join('\n') || '-none-');

console.log('\n  ---\n\nFinal shape of cleared package.json:');
proj.dependencies = newDeps;
proj.devDependencies = newDevDeps;
console.log(JSON.stringify(proj, null, '  '));
