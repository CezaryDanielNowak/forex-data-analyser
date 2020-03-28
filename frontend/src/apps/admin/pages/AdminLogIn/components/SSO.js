import React from 'react';
import sf from 'sf';
import uuid from 'uuid/v4';

import { ADMIN_URL_PREFIX } from 'apps/admin/config';
import BaseComponent from 'components/BaseComponent';
import store from 'sf/helpers/store';

export default class SSO extends BaseComponent {
  className = 'ts-SSO';

  state = {};

  componentDidMount() {
    const ssoToken = uuid();
    const ssoUrl = [
      sf.getConfig('backendURL'),
      '/agent/saml/sso/initiate/',
      '?auth_process_id=',
      ssoToken,
      '&fe_login_url=',
      encodeURIComponent(`${window.location.origin}/${ADMIN_URL_PREFIX}sso-login.html`),
    ].join('');

    this.setState({ // eslint-disable-line react/no-did-mount-set-state
      ssoToken,
      ssoUrl,
    });
  }

  handleClick = () => {
    store.set('ssoToken', this.state.ssoToken);
  }

  render() {
    return (
      <div className={ this.rootcn() }>
        <a
          onClick={ this.handleClick }
          href={ this.state.ssoUrl }
        >
          Login with SSO
        </a>
      </div>
    );
  }
}
