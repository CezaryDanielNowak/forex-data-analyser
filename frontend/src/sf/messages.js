import React from 'react';

import {
  CAMERA_ERROR_TITLE,
  CAMERA_WARNING_TITLE,
  HELP_MESSAGE_CAMERA_NOT_WORKING_CONTENT,
  HELP_MESSAGE_CAMERA_NOT_WORKING_TITLE,
  HELP_MESSAGE_FLASH_NOT_DETECTED_CONTENT,
  HELP_MESSAGE_LOW_CAMERA_RESOLUTION_CONTENT,
  HELP_MESSAGE_CAMERA_IN_USE_CONTENT,
  HELP_DATA_FORM_VALIDATION_FAIL_HEADER,
  HELP_DATA_FORM_VALIDATION_FAIL_TITLE,
} from 'sf/l10n';

/* eslint-disable max-len */
const genericTitle = CAMERA_ERROR_TITLE;
export const HELP_MESSAGE_LOW_CAMERA_RESOLUTION = () => ({
  theme: 'error',
  title: CAMERA_WARNING_TITLE,
  content: HELP_MESSAGE_LOW_CAMERA_RESOLUTION_CONTENT,
});

export const HELP_MESSAGE_CAMERA_NOT_WORKING = () => ({
  theme: 'error',
  title: HELP_MESSAGE_CAMERA_NOT_WORKING_TITLE,
  content: HELP_MESSAGE_CAMERA_NOT_WORKING_CONTENT,
});

export const HELP_MESSAGE_FLASH_NOT_DETECTED = () => ({
  theme: 'error',
  title: genericTitle,
  content: HELP_MESSAGE_FLASH_NOT_DETECTED_CONTENT,
});

export const HELP_MESSAGE_CAMERA_IN_USE = () => ({
  theme: 'error',
  title: HELP_MESSAGE_CAMERA_NOT_WORKING_TITLE,
  content: HELP_MESSAGE_CAMERA_IN_USE_CONTENT,
});

export const HELP_DATA_FORM_VALIDATION_FAIL = ({ validation } = {}) => ({
  testSelector: 'HELP_DATA_FORM_VALIDATION_FAIL',
  headerInfo: HELP_DATA_FORM_VALIDATION_FAIL_HEADER,
  theme: 'error',
  title: HELP_DATA_FORM_VALIDATION_FAIL_TITLE,
  content: (
    <span>
      { Object.keys(validation).map((key) => (
        <span>{ key.replace(/_/g, ' ') }: { validation[key] }</span>
      )) }
    </span>
  ),
});
