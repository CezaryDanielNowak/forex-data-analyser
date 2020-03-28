module.exports = ({ SOURCE_DIR, EXTRA_PATHS = [], throwError }) => {
  const gulp = require('gulp');
  const postcss = require('gulp-postcss');
  const reporter = require('postcss-reporter');
  const sass = require('postcss-scss');
  const stylelint = require('stylelint');

  return function () {
    const processors = [
      stylelint(),
      reporter({
        clearMessages: true,
        throwError
      })
    ];

    return gulp.src([
      `${SOURCE_DIR}/**/*.scss`,
      // And because postcss cannot parse some advanced sass features...
      `!${SOURCE_DIR}/scss/core/*.scss`,
      ...EXTRA_PATHS
    ]).pipe(postcss(processors, {
      syntax: sass
    }));
  };
};
