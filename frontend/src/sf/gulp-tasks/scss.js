'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const sassBulk = require('gulp-sass-bulk-import'); // @import "some/path/*";
const mmq = require('gulp-merge-media-queries');
const sassInlineImage = require('sass-inline-image');
const autoprefixer = require('autoprefixer');
const postcss = require('gulp-postcss');
const rucksack = require('rucksack-css');
const sassVars = require('gulp-sass-vars');

const sassConfig = {
  functions: sassInlineImage()
};
const postProcessors = [
  rucksack(),
  autoprefixer({
    remove: false,
    browsers: ['last 2 versions', '> 1%']
  })
];

module.exports = ({ SOURCE_DIR, IS_WATCH, DESTINATION_DIR, BASE_DIR }) => {
  return () => gulp.src(`${SOURCE_DIR}/*.scss`)
    .pipe(sassVars(require(`${BASE_DIR}/brandingVariables.js`), { verbose: true }))
    .pipe(sassBulk())
    .pipe(
      sass(sassConfig).on('error', function (err) {
        sass.logError.call(this, err);

        if (!IS_WATCH) {
          process.exit(1);
        }
      })
    )
    .pipe(mmq())
    .pipe(postcss(postProcessors))
    .pipe(gulp.dest(DESTINATION_DIR));
};
