'use strict';

const fs = require('fs');
const path = require('path');
const gutil = require('gulp-util');
const mapValues = require('lodash/mapValues');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const noop = require('no-op');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const merge = require('webpack-merge');
const appConfig = require('../../../config');
const getAppEntries = require('../node-helpers/get-app-entries.js');

module.exports = (userWebpackConfig) => {
  const extraWebpackConfig = userWebpackConfig || {};
  const callback = extraWebpackConfig.callback || noop;
  delete extraWebpackConfig.callback;

  const configVariables = mapValues(appConfig, (val) => {
    return JSON.stringify(val);
  });

  const globalVariablesPlugin = Object.assign(configVariables, {
    'process.env': {
      NODE_ENV: appConfig.ENV.substr(0, 5) === 'local' ? '"dev"' : '"production"', // This affects react lib size
    },
  });

  /* eslint-disable import/no-dynamic-require */
  const brandingVariables = require(`${appConfig.BASE_DIR}/brandingVariables`);
  /* eslint-enable */

  const plugins = [
    new webpack.DefinePlugin(globalVariablesPlugin),
    new webpack.LoaderOptionsPlugin({
      options: {
        sassVars: brandingVariables,
      },
    }),
    /* eslint-disable no-useless-escape */
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    /* eslint-enable */
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
  ];

  if (appConfig.DEBUG_BUNDLE_ANALYZE) {
    plugins.push(new BundleAnalyzerPlugin());
  }

  const commonNonLocalConfig = {
    module: {
      rules: [
      ],
    },
    plugins: [
      new webpack.LoaderOptionsPlugin({
        minimize: true,
      }),
      new UglifyJsPlugin({
        uglifyOptions: {
          compress: {
            dead_code: true,
            warnings: false,
            pure_getters: true,
            passes: 2,
          },
          output: {
            comments: false,
            semicolons: true,
          },
        },
      }),
    ],
  };

  const envConfigs = {
    dev: commonNonLocalConfig,
    prod: commonNonLocalConfig,
    local: {
      devtool: '#inline-cheap-module-source-map',
    },
  };

  const commonConfig = merge(
    {
      mode: appConfig.ENV.substr(0, 5) === 'local' ? 'development' : 'production',
      context: appConfig.BASE_DIR,
      performance: {
        hints: 'warning',
      },
      devtool: appConfig.enableSourceMapsJS ? 'source-map' : false,
      // To reduce file size
      node: {
        constants: false,
        console: false,
        global: true,
        process: true,
        Buffer: true,
        __filename: false,
        __dirname: false,
        setImmediate: false,
      },
      module: {
        rules: [
          {
            // every js or jsx file but *.test.js and *.test.jsx
            test: /^(?!.*\.test(\.js)$).*(?:\.js)$/,
            loader: 'babel-loader?cacheDirectory',
            include: [
              appConfig.SOURCE_DIR,
              appConfig.SHARED_FRONTEND_DIR,
            ],
            exclude: [
              /node_modules/,
            ],
          },
          {
            test: /\.(gif|png|jpe?g|svg)$/i,
            use: [
              {
                loader: 'url-loader',
                options: {
                  limit: 20000,
                },
              },
            ],
          },
          {
            test: /\.scss$/,
            use: [
              MiniCssExtractPlugin.loader,
              'css-loader',
              {
                loader: 'postcss-loader',
                options: {
                  config: {
                    path: appConfig.SHARED_FRONTEND_DIR,
                  }
                }
              },
              'sass-loader',
              'sass-vars-loader',
              'sass-bulk-import-loader',
            ],
          },
        ],
      },
      plugins: plugins,
      resolve: {
        modules: [
          appConfig.SOURCE_DIR,
          `${appConfig.SHARED_FRONTEND_DIR}/packages`,
          `${appConfig.BASE_DIR}/node_modules`,
          'tmp',
        ],
        alias: {
          'sf/components/CropImage': 'sf/components/CropImage/CropImageDummy',
          'ie': 'component-ie', // https://github.com/johntron/superagent-no-cache/issues/11
        },
      },
      resolveLoader: {
        modules: [
          'node_modules',
          path.join(appConfig.SHARED_FRONTEND_DIR, 'loaders'),
        ],
      },
    },
    envConfigs[appConfig.ENV] || {},
    extraWebpackConfig,
    { watch: undefined },
  );

  let firstRun = true;
  const webpackCallback = (err, stats) => {
    if (firstRun) {
      // Show what files were used when built
      gutil.log(stats.toString({
        colors: true,
        cached: false,
        children: true,
      }));
      firstRun = false;
      callback();
    }
  };

  const appEntries = getAppEntries();
  const appConfigs = Object.keys(appEntries)
    .reduce((result, appKey) => {
      const entries = appConfig.LANGUAGES.map((lang) => ({
        ...commonConfig,
        plugins: [
          ...commonConfig.plugins,
          new webpack.DefinePlugin({ LANGUAGE: `"${lang || 'en'}"` })
        ],
        entry: {
          [`${appKey}-${lang}`]: appEntries[appKey],
        },
        output: {
          filename: '[name].js', // outputs dist/app-en.js
          globalObject: 'this',
          sourceMapFilename: '[name].js.map',
          libraryTarget: 'umd2',
          path: appConfig.DESTINATION_DIR,
          publicPath: '/',
        },

        resolve: {
          ...commonConfig.resolve,
          alias: {
            ...commonConfig.resolve.alias,
            'l10n': `l10n.${lang}`,
            'sf/l10n': `sf/l10n.${lang}`,
          },
        },
      }));

      result.push(...entries);

      return result;
    }, []);

  const configs = [
    ...appConfigs,
    {
      ...commonConfig,
      entry: {
        'babel-polyfill': 'babel-polyfill'
      },
      output: {
        filename: '[name].js', // outputs dist/babel-polyfill.js
        globalObject: 'this',
        libraryTarget: 'umd2',
        path: appConfig.DESTINATION_DIR
      },
    }
  ];

  return () => {
    const compiler = webpack(configs);

    if (extraWebpackConfig.watch) {
      compiler.watch({
        aggregateTimeout: 300,
        poll: 300,
      }, webpackCallback);
    } else {
      compiler
        .run(webpackCallback);
    }
  };
};
