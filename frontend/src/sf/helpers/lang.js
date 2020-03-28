import { isValidNumber } from 'sf/helpers';

/**
 * Pluralize word
 * Samples:
 *   pluralize('attempt', 1) // 1 attempt
 *   pluralize('attempt', 2) // 2 attempts
 *
 * @param  {string} word
 * @param  {number} amount
 * @return {string}
 */
export const pluralize = (word, amount = 0) => {
  if (!word) throw new Error('No word to pluralize supplied.');
  // NOTE: For "attempts" same function works for english and spanish :-)
  return `${amount} ${word}${amount === 1 ? '' : 's'}`;
};

/**
 * Get ordinal suffix with a number
 * source: https://ecommerce.shopify.com/c/ecommerce-design/t/ordinal-number-in-javascript-1st-2nd-3rd-4th-29259
 * Samples:
 *   getOrdinal(1) // 1st
 *   getOrdinal(2) // 2nd
 *
 * @param  {number} number
 * @return {string}
 */
export const getOrdinal = (number) => {
  if (!isValidNumber(number)) throw new Error('Invalid number provided');
  const s = ['th', 'st', 'nd', 'rd'];
  const v = number % 100;
  return `${number}${(s[(v - 20) % 10] || s[v] || s[0])}`;
};

/**
 * Describe number with words
 * Samples:
 *   numberToWord(0) // zero
 *   numberToWord(-1) // minus one
 *   numberToWord(2) // two
 *   numberToWord(31337) // thirty-one thousand three hundred thirty-seven
 *
 * @param  {number} number
 * @return {string}
 */
/* eslint-disable max-len */
const num = 'zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen'.split(' ');
const tens = 'twenty thirty forty fifty sixty seventy eighty ninety'.split(' ');
export const numberToWords = (number) => {
  if (!isValidNumber(number)) throw new Error('Invalid number provided');
  if (!Number.isFinite(Number(number))) return 'Infinity!';
  if (number > 999999) return `${number}`; // Million is to much
  if (number < 0) return `minus ${numberToWords(-number)}`;
  if (number < 20) return num[number];
  if (number < 100) {
    const digit = number % 10;
    return tens[Math.floor(number / 10) - 2] + (digit ? `-${num[digit]}` : '');
  }
  if (number < 1000) {
    return `${num[Math.floor(number / 100)]} hundred${(number % 100 === 0 ? '' : ` ${numberToWords(number % 100)}`)}`;
  }
  return `${numberToWords(Math.floor(number / 1000))} thousand${(number % 1000 !== 0 ? ` ${numberToWords(number % 1000)}` : '')}`;
};
/* eslint-enable max-len */
