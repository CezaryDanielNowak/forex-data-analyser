import React from 'react';
import { Route } from 'react-router';

import { BASE_PATH } from 'config';
import { ROUTES } from 'constants';
import App from 'layout/App';
import MainLayout from 'layout/MainLayout';
import ErrorPage from 'pages/ErrorPage';
import CorrelationCharts from 'pages/CorrelationCharts';
import AroundHolidays from 'pages/AroundHolidays';
import DayByDay from 'pages/DayByDay';
import MultiScrolling from 'pages/MultiScrolling';
import Index from 'pages/Index';
import Contact from 'pages/Contact';

/* eslint-disable max-len */
export default (
  <Route path="" component={ App } layout={ MainLayout }>
    <Route
      path={ BASE_PATH }
      component={ Index }
    />

    <Route
      path={ ROUTES.CORRELATION_CHART }
      component={ CorrelationCharts }
    />

    <Route
      path={ ROUTES.DAY_BY_DAY }
      component={ DayByDay }
    />
    <Route
      path={ ROUTES.AROUND_HOLIDAYS }
      component={ AroundHolidays }
    />

    <Route
      path={ ROUTES.MULTI_SCROLLING }
      component={ MultiScrolling }
    />

    <Route
      path={ ROUTES.CONTACT }
      component={ Contact }
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
