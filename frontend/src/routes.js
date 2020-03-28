import React from 'react';
import { Route } from 'react-router';

import { BASE_PATH } from 'config';
import { ROUTES } from 'constants';
import App from 'layout/App';
import MainLayout from 'layout/MainLayout';
import ErrorPage from 'pages/ErrorPage';
import Index from 'pages/Index';

/* eslint-disable max-len */
export default (
  <Route path="" component={ App } layout={ MainLayout }>
    <Route
      path={ BASE_PATH }
      component={ Index }
    />
    <Route
      path={ ROUTES.INDEX }
      component={ Index }
    />

    <Route path={ ROUTES.NOT_FOUND } component={ ErrorPage } />
    <Route path="*" component={ ErrorPage } />
  </Route>
);

/* eslint-enable  */
