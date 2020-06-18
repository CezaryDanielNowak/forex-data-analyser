
const glob = require('glob');
const _ = require('lodash');
const csv = require('csv-parser');
const fs = require('fs');
const config = require('./config');

const cache = {
  filePaths: {}
};

function prepareResponse(err, responseData) {
  if (err) {
    if (Object.hasOwnProperty.call(err, 'error_code')) {
      return err;
    }
    return {
      error_code: err.name,
      status_message: err instanceof Error ? `${err.name}: ${err.message}` : `${err}`,
      data: responseData,
    }
  }

  return {
    data: responseData
  }
}

module.exports = ({ app }) => {

  app.get('/', (req, res) => res.send('Hello World!'));

  app.get('/api/get_available_sources', async (req, res) => {
    const filePaths = await getCSVFilePaths(config.DATA_DIR);
    const output = filePaths.map((fileName) => fileName.split('/').pop());

    res.json(prepareResponse(null, output));
  });


  // /api/get_data?source=POL20Cash_M1.CSV&dateFrom=2020.03.20&dateTo=2020.03.25
  app.get('/api/get_data', async (req, res) => {
    // params:
    // source: one of get_available_sources
    // dateFrom: following format: `2020.03.20`
    // dateTo: following format: `2020.03.20`
    const {
      source,
      dateFrom,
      dateTo,
    } = req.query;
    const filePath = getFilePathFromFileName(source, await getCSVFilePaths(config.DATA_DIR));

    if (!filePath) {
      return res
        .status(400)
        .json(prepareResponse({ error_code: 'INVALID_FILE_NAME' }));
    }

    const dataFromCSV = await readCSV(filePath);
    let filteredDataFromCSV = dataFromCSV;

    if (dateFrom && dateTo) {
      filteredDataFromCSV = selectByDateRange(dataFromCSV, dateFrom, dateTo, 'date');
    }

    return res
      .json(prepareResponse(null, filteredDataFromCSV));
  });


// /api/get_data_intersection?source[]=GER30Cash_M1.CSV&source[]=POL20Cash_M1.CSV&dateFrom=2020.03.20&dateTo=2020.03.25
  app.get('/api/get_data_intersection', async (req, res) => {
    // params:
    // source[]: results from get_available_sources
    // dateFrom: following format: `2020.03.20`
    // dateTo: following format: `2020.03.20`
    const {
      source,
      dateFrom,
      dateTo,
    } = req.query;
    let dataFromCSV;

    const allFilePaths = await getCSVFilePaths(config.DATA_DIR);
    const filePaths = source.map((sourceFileName) => {
      return getFilePathFromFileName(sourceFileName, allFilePaths);
    });

    if (filePaths.length !== 2) {
      return res
        .status(400)
        .json(prepareResponse({ error_code: 'INVALID_FILE_NAME' }));
    }

    try {
      dataFromCSV = await Promise.all(filePaths.map((filePath) => readCSV(filePath)));
    } catch(e) {
      return res
        .status(400)
        .json(prepareResponse({ error_code: 'INVALID_CSV_FILE_CONTENT', status_message: e }));
    }

    let filteredDataFromCSV = dataFromCSV;

    if (dateFrom && dateTo) {
      filteredDataFromCSV = dataFromCSV.map((singleDataFromCSV) => {
        return selectByDateRange(singleDataFromCSV, dateFrom, dateTo, 'date');
      });
    }

    return res
      .json(prepareResponse(null, filteredDataFromCSV));
  });
}

function getCache(functionName, _args) {
  const args = Array.from(_args);
  const cacheField = `${functionName}-${args.map((arg) => `${arg}`).join('|')}`;
  if (cache[cacheField]) return cache[cacheField];
}

function setCache(functionName, _args, data) {
  const args = Array.from(_args);
  const cacheField = `${functionName}-${args.map((arg) => `${arg}`).join('|')}`;
  cache[cacheField] = data;

  setTimeout(() => {
    delete cache[cacheField];
  }, config.CACHE_TIMEOUT);
}

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


function getCSVFilePaths(DATA_DIR) {
  const argsForCache = arguments;
  const dataFromCache = getCache('getCSVFilePaths', argsForCache);
  if (dataFromCache) return Promise.resolve(dataFromCache);

  return new Promise((resolve, reject) => {
    glob(DATA_DIR + '/*.CSV', {}, (err, files) => {
      if (err) {
        return reject(err);
      }
      setCache('getCSVFilePaths', argsForCache, files);

      resolve(files);
    });
  });
}

function getFilePathFromFileName(fileName, fileNames) {
  const fileNameLength = fileName.length;
  return fileNames.find((filePath) => {
    return filePath.substr(-fileNameLength) === fileName;
  });
}

// source: https://gist.github.com/CezaryDanielNowak/5840923429fc4a6b91c6eba83cf12ba4
function selectByDateRange(arr, from, to, fieldName = 'date') {
  const result = [];
  for(let i = 0, max = arr.length; i < max; ++i) {
    if (arr[i][fieldName] >= from && arr[i][fieldName] <= to) {
      result.push(arr[i]);
    }
  }
  return result;
}

function intersect(a, b) {
  if (arguments.length !== 2) {
    throw new Error('intersect requires 2 parameters. Handling more is not implemented yet.');
  }
  var setA = new Set(a);
  var setB = new Set(b);
  var intersection = new Set([...setA].filter(x => setB.has(x)));
  return Array.from(intersection);
}
