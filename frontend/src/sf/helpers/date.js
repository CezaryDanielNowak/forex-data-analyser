const dateHelper = {};

dateHelper.months = [
  { value: '1', label: 'January' },
  { value: '2', label: 'February' },
  { value: '3', label: 'March' },
  { value: '4', label: 'April' },
  { value: '5', label: 'May' },
  { value: '6', label: 'June' },
  { value: '7', label: 'July' },
  { value: '8', label: 'August' },
  { value: '9', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' }
];

dateHelper.SEC = 1000;
dateHelper.MIN = 60 * dateHelper.SEC;
dateHelper.HOUR = 60 * dateHelper.MIN;
dateHelper.DAY = 24 * dateHelper.HOUR;
dateHelper.WEEK = 7 * dateHelper.DAY;
dateHelper.YEAR = 365.25 * dateHelper.DAY;
dateHelper.MONTH = dateHelper.YEAR / 12;

dateHelper.toLocaleISOString = (date, offsetMinutes = -this.getTimezoneOffset()) => {
  const offsetMs = offsetMinutes * dateHelper.MIN;
  const pad = function (num) {
    const norm = Math.floor(Math.abs(num));
    return (norm < 10 ? '0' : '') + norm;
  };
  const localISOTime = (new Date(Date.now() + offsetMs)).toISOString().slice(0, -1);

  const dif = offsetMinutes >= 0 ? '+' : '-';
  return `${localISOTime}${dif}${pad(offsetMinutes / 60)}:${pad(offsetMinutes % 60)}`;
};

/**
 * converts Date object to YYYY.MM.DD string
 *
 * @param  {Date} date
 * @return {string}
 */
dateHelper.dateToString = (date) => {
  if (typeof date === 'string') {
    return date;
  }

  return dateHelper.toLocaleISOString(date, 120).substr(0, 10).replace(/-/g, '.'); // 120 = GMT+0200
};

/**
 * converts YYYY.MM.DD string to Date object
 * @param  {string} dateString
 * @return {Date}      [description]
 */
dateHelper.stringToDate = (date, time = '12:00:00') => {
  if (date instanceof Date) {
    return date;
  }
  // TODO:
  // we asume GMT-0200 is a broker's timezone, as most european brokers uses that.
  return new Date(Date.parse(`${date.replace(/\./g, '-')} ${time} GMT+0200`));
};

/**
 * Formats input parts into DD/MM/YYYY format with padding. It's ommiting Date
 * format and operates on strings, so we don't loose OCR data.
 *
 * @param  {[type]} mm   Month
 * @param  {[type]} dd   Day
 * @param  {[type]} yyyy Year
 */
dateHelper.formatUSDate = (mm = 0, dd = 0, yyyy = 0) => {
  if (!parseInt(mm, 10) && !parseInt(dd, 10) && !parseInt(yyyy, 10)) {
    return '';
  }

  const mmPad = `00${mm}`.slice(-2);
  const ddPad = `00${dd}`.slice(-2);
  const yyyyPad = `0000${yyyy}`.slice(-4);

  return `${mmPad}/${ddPad}/${yyyyPad}`;
};


/**
 * toISODate returns date in format: YYYY-MM-DD
 * @param  {Date} dateObj
 * @return {string}
 */
dateHelper.toISODate = (dateObj) => {
  if (!(dateObj instanceof Date)) throw new Error('Not a valid instance of Date.');
  const yyyy = dateObj.getFullYear();
  const mm = `0${(dateObj.getMonth() + 1)}`.slice(-2);
  const dd = `0${dateObj.getDate()}`.slice(-2);

  return `${yyyy}-${mm}-${dd}`;
};

dateHelper.getDate = (usDateString) => {
  if (!usDateString) throw new Error('No US date string provided.');
  return new Date(usDateString);
};

export default dateHelper;
