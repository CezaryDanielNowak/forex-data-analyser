'use strict';

require('babel-polyfill');
const childProcess = require('child_process');
const fs = require('fs');
const gulp = require('gulp');
const gulpMultiProcess = require('gulp-multi-process');
const gutil = require('gulp-util');
const first = require('lodash/first');
const path = require('path');
const config = require('../../config');
const copyAndCheckTask = require('./gulp-tasks/copy-and-check.js');
const { getLint, getLintWatch } = require('./gulp-tasks/lint.js');


process.on('SIGINT', function () {
  const pid = process.pid;
  const kill = require('tree-kill');

  kill(pid, 'SIGKILL');
});

const WATCH_OPTIONS = {
  interval: 600,
  ignoreInitial: true,
};

const buildIndex = () => {
  return new Promise((resolve, reject) => {
    // build index.html file.
    const serverRendering = require('./gulp-tasks/server-rendering.js');
    serverRendering
      .generateMarkup('/index.html', `app-${first(config.LANGUAGES)}.js`)
      .then((fileContents) => {
        if (!fileContents.data) {
          throw new Error(`index.html build failure ${fileContents}`);
        }

        fs.writeFile(`${config.DESTINATION_DIR}/index.html`, fileContents.data, (err) => {
          if (err) {
            gutil.log('ERROR build-html: index.html', err);
            reject();
          } else {
            resolve();
          }
        });
      });
  });
};

function ensureDirectoryExistence(filePath) {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

const eslintDirs = [
  '../**/*.js',
  '!../**/*.test.js',
  '!../**/assets/**/*',
  '!../**/dist/**/*',
  '!../**/node_modules/**/*',
  '!gulp-tasks/**/*',
  '!packages/**/*',
];

gulp.task('copy-and-check-task', copyAndCheckTask(config));

gulp.task('lint', getLint({ eslintDirs }));
gulp.task('lint:watch-subprocess', getLintWatch({ watchOptions: WATCH_OPTIONS, eslintDirs }));
gulp.task('lint:watch', (cb) => {
  gulpMultiProcess(['lint:watch-subprocess'], cb);
});

// === WEBPACK ===
gulp.task('webpack', (callback) => require('./gulp-tasks/webpack')({
  watch: false,
  callback,
})());

gulp.task('webpack:watch', require('./gulp-tasks/webpack')({
  watch: true,
  callback: () => {



    // run watch at the end to get results faster
    gulp.start('lint:watch');
  },
}));

// === SERVER ===
gulp.task('server', require('./gulp-tasks/server')());

// === COPY ASSETS & BUILD HTML ===
const assetsDirs = [
  `${config.ASSETS_DIR}/**/*`,
];
gulp.task('copy-subprocess', () => {
  // copy everything from assets/ and pick just specific files from src/
  return gulp.src(assetsDirs)
    .pipe(gulp.dest(config.DESTINATION_DIR));
});

gulp.task('copy', (cb) => {
  // copy everything from assets/ and pick just specific files from src/
  return gulpMultiProcess(['copy-subprocess'], cb);
});

gulp.task('copy:watch', ['copy'], () => {
  // NOTE:
  // "copy" and "copy:watch" are not called in development mode (watch) to speedup
  // the process. Files are served from /assets directory directly
  //
  if (config.ENV !== 'local') {
    return gulp.watch(assetsDirs, WATCH_OPTIONS, ['copy']);
  }
});

gulp.task('build-html', () => {
  // build html files.
  const serverRendering = require('./gulp-tasks/server-rendering.js');
  const getAppEntries = require('./node-helpers/get-app-entries.js');

  const appEntries = getAppEntries();
  Object.keys(appEntries).forEach((appKey) => {
    config.LANGUAGES
      .forEach((lang) => {
        serverRendering
          .getAllPages(`${appKey}-${lang}.js`)
          .then((pages) => {
            Object.keys(pages).forEach((pageName) => {
              const fileContents = pages[pageName];
              let fileName = pageName.replace(/^\//, '');
              if (!fileName) {
                fileName = 'index.html';
              }

              if (/\.html$/.test(fileName)) {
                const filePath = `${config.DESTINATION_DIR}/${fileName}`;
                ensureDirectoryExistence(filePath);
                fs.writeFile(filePath, fileContents, (err) => {
                  if (err) {
                    gutil.log(`ERROR build-html: ${fileName}`, err);
                  }
                });
              }
            });
          }, console.error); // eslint-disable-line no-console
      });
  });
});

gulp.task('build-html:index', () => {
  buildIndex();
});

// === CLEAN DIST ===
gulp.task('clean', () => {
  const command = `rm -rf ${config.DESTINATION_DIR}/*`;
  /* eslint-disable no-console */
  console.log(`[EXECUTE] ${command}`);
  /* eslint-enable */
  childProcess.execSync(command, {
    stdio: 'pipe',
  });
});



gulp.task('run-api', () => {
  const { exec } = require('child_process');

  const parseStdout = (_data) => {
    const data = _data.toString().split('\n');


    return data.map((line) => {
      return `[API] ${line}`;
    }).join('\n');
  };

  const ls = exec(`cd ${path.resolve(config.BASE_DIR, '../')} && make start-api`, (error, stdout, stderr) => {});

  ls.stdout.on('data', function (data) {
    console.log(parseStdout(data));
  });

  ls.stderr.on('data', (data) => {
    console.error(parseStdout(data));
  });

  ls.on('exit', (code) => {
    console.log('EXIT API ', code);
  });
});

// === PUBLIC ===
gulp.task('watch', [
  'run-api', 'clean', 'webpack:watch', 'copy-and-check-task',
], () => {
  gulp.start('copy:watch');
  gulp.start('server');
});

gulp.task('build', [
  'clean', 'webpack', 'lint', 'copy-and-check-task', 'copy',
], () => {
  gulp.start('build-html');
});

gulp.task('init-component', () => {
  gulp.start(require('./gulp-tasks/init-component')('components'));
});

gulp.task('init-page', () => {
  gulp.start(require('./gulp-tasks/init-component')('pages'));
});

gulp.task('lint-scss', require('./gulp-tasks/scss-lint')({
  SOURCE_DIR: __dirname,
  EXTRA_PATHS: [`${__dirname}/*.scss`],
  throwError: true
}));
