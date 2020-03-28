const gulp = require('gulp');
const colors = require('colors');
const path = require('path');
const fs = require('fs');

/* istanbul ignore next */
module.exports = (config) => {
  const checkConfig = () => {
    if (config.ASSETS_URL.substr(-1) !== '/') {
      // eslint-disable-next-line no-console
      console.log(colors.red('ASSETS_URL should end with a slash'));
      process.exit();
    }
  };

  const checkModules = () => {
    const nodeModulesPath = path.resolve(config.SHARED_FRONTEND_DIR, 'node_modules');
    if (fs.existsSync(nodeModulesPath)) {
      // eslint-disable-next-line
      console.log(colors.red(`${nodeModulesPath} exists. Make sure to remove it and use npm3/yarn.`));
    }
  };

  const copyModules = () => {
    // copy custom elements from node_modules directory
    gulp.src(`${config.BASE_DIR}/node_modules/react-select/dist/**/*`)
      .pipe(gulp.dest(`${config.DESTINATION_DIR}/lib/react-select`));

    gulp.src(`${config.BASE_DIR}/node_modules/inputmask/dist/min/inputmask/**/*`)
      .pipe(gulp.dest(`${config.DESTINATION_DIR}/lib/inputmask`));

    gulp.src(`${config.BASE_DIR}/node_modules/react-table/*.css`)
      .pipe(gulp.dest(`${config.DESTINATION_DIR}/lib/react-table/`));

    gulp.src(`${config.BASE_DIR}/node_modules/prismjs/themes/*.css`)
      .pipe(gulp.dest(`${config.DESTINATION_DIR}/lib/prismjs/`)); // JsonPrettyPrint

    gulp.src(`${config.BASE_DIR}/amcharts4/dist/script/**/*`)
      .pipe(gulp.dest(`${config.DESTINATION_DIR}/lib/amcharts4/`));

  };

  return () => {
    checkConfig();
    checkModules();
    copyModules();
  };
};
