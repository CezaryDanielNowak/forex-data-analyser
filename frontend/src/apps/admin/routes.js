import React from 'react';
import { Route } from 'react-router';

import { BASE_PATH } from 'config';
import { ADMIN_URL_PREFIX } from 'apps/admin/config';
import requireAdminAuthorization from 'apps/admin/hoc/RequireAdminAuthorization';
import AdminLayout from 'apps/admin/layout/AdminLayout';
import App from 'layout/App';
import MainLayout from 'layout/MainLayout';
import ErrorPage from 'pages/ErrorPage';
import AdminApp from 'apps/admin/pages/AdminApp';
import AdminAuthentications from 'apps/admin/pages/AdminAuthentications';
import AdminLogIn from 'apps/admin/pages/AdminLogIn';

/* eslint-disable max-len */


export default (
  <Route path="" component={ App } layout={ MainLayout }>
    <Route path="AdminApp" component={ AdminApp } layout={ AdminLayout }>
      <Route
        path={ `${BASE_PATH}${ADMIN_URL_PREFIX}admin.html` }
        component={ AdminLogIn }
      />
      <Route
        path={ `${BASE_PATH}${ADMIN_URL_PREFIX}admin-authentications.html` }
        component={ requireAdminAuthorization(AdminAuthentications) }
      />
    </Route>

    <Route path="*" component={ ErrorPage } />
  </Route>
);

/* eslint-enable  */
