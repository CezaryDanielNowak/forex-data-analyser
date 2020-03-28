import React from 'react';
import PropTypes from 'prop-types';

import PageTitle from 'components/PageTitle';
import BasePage from 'pages/BasePage';
import SSO from 'apps/admin/pages/AdminLogIn/components/SSO';
import PasswordLogIn from 'apps/admin/pages/AdminLogIn/components/PasswordLogIn';

export default class AdminLogIn extends BasePage {
  className = 'ts-AdminLogIn';
  title = 'Login to Administration Panel';

  static propTypes = {
    passwordLoginEnabled: PropTypes.bool,
    ssoEnabled: PropTypes.bool,
  };

  static defaultProps = {
    passwordLoginEnabled: true,
    ssoEnabled: false,
  };

  render() {
    return (
      <div className={ this.rootcn`` }>
        <div className="ts-container ts-container--narrow">
          <PageTitle title={ this.title } />

          { this.props.passwordLoginEnabled && <PasswordLogIn /> }

          { this.props.passwordLoginEnabled
            && this.props.ssoEnabled
            && <hr className="ts-or" />
          }

          { this.props.ssoEnabled && <SSO className="ts-center" /> }
        </div>
      </div>
    );
  }
}
