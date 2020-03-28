/**
 * Transforms linear progress to an ease-in-out one
 * @param  {number} progress 0 <= progress <= 1
 * @return {number}          eased progress, 0 <= progress <= 1
 */

/* eslint-disable import/prefer-default-export */
// TODO: remove ☝️ after adding next methods
export const easeInOut = (progress = 0) => (Math.sin(
  (Math.PI / -2) + Math.min(progress, 1) * Math.PI
) + 1) / 2;
/* eslint-enable */
