import React from 'react';
import is from 'next-is';

const {
  RYE_1_CONTENT_DESKTOP,
  RYE_1_CONTENT_MOBILE,
  RYE_1_TITLE,
  RYE_2_CONTENT,
  RYE_2_TITLE,
  RYE_3_CONTENT,
  RYE_3_TITLE,
} = require(`./l10n.${LANGUAGE}`); // eslint-disable-line import/no-dynamic-require

export default () => [
  {
    title: RYE_1_TITLE,
    imageMobile: 'img/TutorialTest/rye_1-mobile.svg',

    imageDesktop: 'img/TutorialTest/rye_1.svg',

    content: (
      <span>
        { is.mobile() ? RYE_1_CONTENT_MOBILE : RYE_1_CONTENT_DESKTOP }
      </span>
    ),
  },

  {
    title: RYE_2_TITLE,
    imageMobile: 'img/TutorialTest/rye_2.gif',

    imageDesktop: 'img/TutorialTest/rye_2.gif',

    content: (
      <span>
        { RYE_2_CONTENT }
      </span>
    ),
  },

  {
    title: RYE_3_TITLE,
    imageMobile: 'img/TutorialTest/rye_3.gif',

    imageDesktop: 'img/TutorialTest/rye_3.gif',

    content: RYE_3_CONTENT,
  },
];
