import is from 'next-is';

const {
  POPPY_1_CONTENT_DESKTOP,
  POPPY_1_CONTENT_MOBILE,
  POPPY_1_TITLE,
  POPPY_2_CONTENT,
  POPPY_2_TITLE,
} = require(`./l10n.${LANGUAGE}`); // eslint-disable-line import/no-dynamic-require

/* eslint-disable max-len */
export default () => [
  {
    title: POPPY_1_TITLE,
    imageMobile: 'img/TutorialTest/poppy_1-mobile.svg',

    imageDesktop: 'img/TutorialTest/poppy_1.png',

    content: is.mobile()
      ? POPPY_1_CONTENT_MOBILE
      : POPPY_1_CONTENT_DESKTOP,
  },

  {
    title: POPPY_2_TITLE,
    imageMobile: 'img/TutorialTest/poppy_2-mobile.png',

    imageDesktop: 'img/TutorialTest/poppy_2.png',

    content: POPPY_2_CONTENT,
  },

];
