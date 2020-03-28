import React from 'react';

import { ADMIN_URL_PREFIX } from 'apps/admin/config';
import { ADMIN_HELP_PASSWORD_EXPIRED } from 'apps/admin/messages';
import ExpirationWarning from 'apps/admin/components/ExpirationWarning';
import BasePage from 'pages/BasePage';
import { mediator } from 'sf/helpers';

export default class AdminApp extends BasePage {
  className = 'ts-AdminApp';

  handlePasswordExpiration() {
    this.subscribe('requestHelper--error', (errorCode) => {
      if (errorCode === 'PASSWORD_EXPIRED') {
        this
          .navigate(`/${ADMIN_URL_PREFIX}admin-change-password.html`, 'push')
          .then(() => mediator.publish('showHelp', ADMIN_HELP_PASSWORD_EXPIRED()));
      }
    });
  }

  componentWillMount() {
    this.handlePasswordExpiration();
  }

  render() {
    return (
      <div className={ this.rootcn`` }>
        <ExpirationWarning />
        { this.props.children }
      </div>
    );
  }
}
