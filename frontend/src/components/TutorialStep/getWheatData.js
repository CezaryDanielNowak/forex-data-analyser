const {
  WHEAT_1_TITLE_MOBILE,
  WHEAT_1_TITLE_DESKTOP,
  WHEAT_1_CONTENT_MOBILE,
  WHEAT_1_CONTENT_DESKTOP,
  WHEAT_2_TITLE,
  WHEAT_2_CONTENT,
  WHEAT_3_TITLE,
  WHEAT_3_CONTENT
} = require(`./l10n.${LANGUAGE}`); // eslint-disable-line import/no-dynamic-require

export default () => [
  {
    titleMobile: WHEAT_1_TITLE_MOBILE,
    imageMobile: 'img/TutorialTest/wheat_1-mobile.svg',

    titleDesktop: WHEAT_1_TITLE_DESKTOP,
    imageDesktop: 'img/TutorialTest/wheat_1.png',

    contentMobile: WHEAT_1_CONTENT_MOBILE,
    contentDesktop: WHEAT_1_CONTENT_DESKTOP,
  },

  {
    title: WHEAT_2_TITLE,
    imageMobile: 'img/TutorialTest/wheat_2-mobile.png',

    imageDesktop: 'img/TutorialTest/wheat_2.png',

    content: WHEAT_2_CONTENT,
  },


  {
    title: WHEAT_3_TITLE,
    imageMobile: 'img/TutorialTest/wheat_3-mobile.png',

    imageDesktop: 'img/TutorialTest/wheat_3.png',

    content: WHEAT_3_CONTENT,
  },
];
