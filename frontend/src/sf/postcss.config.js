const autoprefixer = require('autoprefixer');
const lost = require('lost');
const mergeMediaQueries = require('postcss-move-media');
const rucksack = require('rucksack-css');

module.exports = {
  plugins: [
    rucksack(),
    lost(),
    mergeMediaQueries(),
    autoprefixer({
      remove: false,
      browsers: ['last 2 versions', '> 1%'],
    }),
  ],
};
