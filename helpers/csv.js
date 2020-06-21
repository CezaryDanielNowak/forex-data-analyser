const csv = require('csv-parser');
const fs = require('fs');
const { getCache, setCache } = require('./cache');

function parseRowData(row) {
  row.open *= 1;
  row.high *= 1;
  row.low *= 1;
  row.close *= 1;
  row.tick_volume *= 1;

  return row;
}

function readCSV(filePath) {
  const argsForCache = arguments;
  const dataFromCache = getCache('readCSV', argsForCache);
  if (dataFromCache) return Promise.resolve(dataFromCache);

  const results = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv(['date', 'time', 'open', 'high', 'low', 'close', 'tick_volume']))
      .on('data', (row) => results.push(parseRowData(row)))
      .on('end', () => {
        setCache('readCSV', argsForCache, results);

        resolve(results);
      })
      .on('error', reject);
  });
}


module.exports = {
  readCSV: readCSV,
};
