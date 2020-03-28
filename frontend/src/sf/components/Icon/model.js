import atom from 'atom-js';
import { asset } from 'sf/helpers';
import { get } from 'sf/helpers/request';
import is from 'next-is';
import noop from 'no-op';

const noIcon = '<?xml version="1.0"?><svg width="40" height="40" viewBox="0 0 40 40"></svg>';
const requestCache = {};

const model = atom();

model.fetchIcon = (iconName, iconSet, callback) => {
  const iconID = `${iconSet}/${iconName}`;
  const cachedIcon = model.get(iconID);
  if (cachedIcon) {
    return callback(cachedIcon);
  }

  model.once(iconID, callback);
  if (!requestCache[iconID]) {
    get(asset`icons/${iconID}.svg`)
      .set('Accept', 'image/svg+xml')
      .end((err, res) => {
        if (err) {
          console.error('fetching icon failed', iconID, err); // eslint-disable-line no-console

          model.set(iconID, noIcon);
        } else {
          model.set(iconID, res.text);
        }
      }, { disableMediator: true });
    requestCache[iconID] = true; // prevent from multiple ajax calls
  }
};

/**
 * Cache/prefetch icons before it's used.
 *
 * example:
 *   prefetch(
 *     { set: 'ab', type: 'cde' },
 *     { set: 'fg', type: 'hij' },
 *     ...
 *   )`
 */
model.prefetch = (...iconsToCache) => {
  if (!is.browser()) return;

  iconsToCache.forEach(({ set, type }) => {
    model.fetchIcon(type, set, noop);
  });
};

export default model;
