
// TODO Remove me.

const BASE_PATH = global.location && global.location.pathname.match(/^.*[\\/]/, '')[0]
  || `/${LANGUAGE === 'en' ? '' : `${LANGUAGE}/`}`;

export default {
  // BASE_PATH is used in cases, when website is hosted from subdirectory.
  BASE_PATH: BASE_PATH,
};
