
const glob = require('glob');
const _ = require('lodash');

const config = require('./config');
const { getCache, setCache } = require('./helpers/cache');
const { readCSV } = require('./helpers/csv');

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

async function getFilteredDataFromSingleSVG(req, res) {
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
  let dataFromCSV;

  if (!filePath) {
    res
      .status(400)
      .json(prepareResponse({ error_code: 'INVALID_FILE_NAME' }));

    return false;
  }

  try {
    dataFromCSV = await readCSV(filePath);
  } catch(e) {
    console.error(e);
    res
      .status(400)
      .json(prepareResponse({ error_code: 'INVALID_CSV_FILE_CONTENT', status_message: e }));
    return false;
  }
  let filteredDataFromCSV = dataFromCSV;

  if (dateFrom && dateTo) {
    filteredDataFromCSV = selectByDateRange(dataFromCSV, dateFrom, dateTo, 'date');
  }

  return filteredDataFromCSV;
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
    const filteredDataFromSVG = await getFilteredDataFromSingleSVG(req, res);

    if (filteredDataFromSVG === false) { // when false, error was already handled.
      return;
    }

    return res
      .json(prepareResponse(null, filteredDataFromSVG));
  });

  // /api/get_day_by_day_data?source=POL20Cash_M1.CSV&dateFrom=2020.03.20&dateTo=2020.03.25
  app.get('/api/get_day_by_day_data', async (req, res) => {
    // params:
    // source: one of get_available_sources
    // dateFrom: following format: `2020.03.20`
    // dateTo: following format: `2020.03.20`
    /*
returns data like this:
    [
      [ // Mon
        [
          {"date":"2020.06.08","time":"10:02","open":1841,"high":1843,"low":1841,"close":1843,"tick_volume":3},
          ...
        ],
        [
          {"date":"2020.06.15","time":"10:02","open":1841,"high":1843,"low":1841,"close":1843,"tick_volume":3},
          ...
        ]
      ],

      [ // Tue
        [
          {"date":"2020.06.09","time":"10:02","open":1841,"high":1843,"low":1841,"close":1843,"tick_volume":3},
          ...
        ],
        [
          {"date":"2020.06.16","time":"10:02","open":1841,"high":1843,"low":1841,"close":1843,"tick_volume":3},
          ...
        ]
      ]
    ]

    days can be distingushed by array's id:
    0: Mon
    1: Tue
    etc.

     */
    const filteredDataFromSVG = await getFilteredDataFromSingleSVG(req, res);

    if (filteredDataFromSVG === false) { // when false, error was already handled.
      return;
    }

    const { stringToDate, getWeek } = require('./frontend/src/sf/helpers/date');
    const result = [ // fill array with 53 weeks
      {}, // 0 - Sun
      {}, // 1 - Mon
      {},
      {},
      {},
      {},
      {},
    ];

    filteredDataFromSVG.forEach((row) => {
      const date = stringToDate(row.date, row.time);

      if (!result[date.getDay()][`${date.getYear()}-${getWeek(date)}`]) {
        result[date.getDay()][`${date.getYear()}-${getWeek(date)}`] = [];
      }

      result[date.getDay()][`${date.getYear()}-${getWeek(date)}`].push(row);
    });


    result.forEach((dayElement, i) => {
      const keys = Object.keys(dayElement);
      const objToArr = keys.map((key) => {
        return dayElement[key];
      });

      result[i] = objToArr;
    });

    return res
      .json(prepareResponse(null, result));
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
      return resfilePaths
        .status(400)
        .json(prepareResponse({ error_code: 'INVALID_CSV_FILE_CONTENT', status_message: e }));
    }

    let filteredDataFromCSV = dataFromCSV;

    if (dateFrom && dateTo) {
      filteredDataFromCSV = dataFromCSV.map((singleDataFromCSV) => {
        return selectByDateRange(singleDataFromCSV, dateFrom, dateTo, 'date');
      });
    }

    const intersectionForFilteredDataFromCSV = arrayIntersection(filteredDataFromCSV, ['date', 'time']);

    return res
      .json(prepareResponse(null, intersectionForFilteredDataFromCSV));
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
  for (let i = 0, max = arr.length; i < max; ++i) {
    if (arr[i][fieldName] >= from && arr[i][fieldName] <= to) {
      result.push(arr[i]);
    }
  }
  return result;
}

function arrayIntersection(arr, primaryKeys) {
  if (arr.length !== 2) {
    throw new Error('arrayIntersection requires 2 parameters. Handling more is not implemented yet.');
  }

  // order in objects is preserved ! https://stackoverflow.com/a/23202095/2590921
  const tmpResults = [{}, {}]; // array of objects

  for (let iteration = 1; iteration >= 0; --iteration) {
    /**
     * this nested iteration does following:
     * [
     *   [
     *     {id: 1, value: 1},
     *     {id: 2, value: 2},
     *   ],
     *   [
     *     {id: 3, value: 3},
     *     {id: 4, value: 4},
     *   ]
     * ]
     *
     * when `primaryKeys = ['id']`:
     * [
     *   {
     *     id1: {id: 1, value: 1},
     *     id2: {id: 2, value: 2},
     *   },
     *   {
     *     id3: {id: 3, value: 3},
     *     id4: {id: 4, value: 4},
     *   },
     * ]
     */

    for (var i = 0, len = arr[iteration].length; i < len; ++i) {
      tmpResults[iteration][primaryKeys.map((key) => `${key}${arr[iteration][i][key]}`).join('_')] = arr[iteration][i];
    }
  }

return Object
  .keys(tmpResults[0])
  .reduce((acc, key) => {
    if (key in tmpResults[1]) {
      acc[0].push(tmpResults[0][key]);
      acc[1].push(tmpResults[1][key]);
    }

    return acc;
  }, [[], []]);
}
