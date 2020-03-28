const eslint = require('gulp-eslint');
const gulp = require('gulp');

const getLint = ({ eslintDirs }) => () => {
  const eslintEscopeVersion = require('eslint-scope/package.json').version;
  if (eslintEscopeVersion === '3.7.2') {
    // Read more:
    // https://github.com/eslint/eslint-scope/issues/39
    // https://reddit.app.link/wU7l1bdVuO
    /* eslint-disable no-console */
    console.warn('eslint-scope 3.7.2 is compromised. Eslint process won\'t be performed.');
    console.warn('Install older version manually: `yarn add eslint-escope@3.7.1`');
    /* eslint-enable */
    return;
  }
  return gulp.src(eslintDirs)
    .pipe(eslint())
    .pipe(eslint.format());
};

const getLintWatch = ({ eslintDirs, watchOptions }) => {
  // NOTE: initial gulp.watch for eslintDirs is EXTREMALLY slow.
  // for now, we are moving that to subprocess, but in the future, we
  // should check what is the reason of slowness

  return () => {
    setTimeout(() => gulp.start('lint'));

    const watcher = gulp
      .watch(eslintDirs, watchOptions, ['lint']);

    // TODO: instead of linting everything on change, lint just changed/added files
    // watcher.on('change', console.log);

    return watcher;
  };
};

const getLintFailable = ({ eslintDirs }) => () => {
  return gulp.src(eslintDirs)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
};

module.exports = {
  getLintWatch,
  getLint,
  getLintFailable,
};
