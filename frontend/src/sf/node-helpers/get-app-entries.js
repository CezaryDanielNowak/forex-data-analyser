const fs = require('fs');
const path = require('path');
const appConfig = require('../../../config');

module.exports = () => {
  if (appConfig.SF_WEBPACK_ENTRIES) {
    return appConfig.SF_WEBPACK_ENTRIES;
  }

  const appEntryPath = path.join(
    appConfig.SOURCE_DIR,
    'apps',
    appConfig.BRAND_NAME,
    'app.js'
  );

  const appEntry = fs.existsSync(appEntryPath)
    ? appEntryPath
    : path.join(appConfig.SOURCE_DIR, 'app.js');

  return {
    app: appEntry,
  };
};
