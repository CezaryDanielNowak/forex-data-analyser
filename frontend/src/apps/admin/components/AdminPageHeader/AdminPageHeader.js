import React from 'react';
import { ADMIN_URL_PREFIX } from 'apps/admin/config';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import BaseComponent from 'sf/components/BaseComponent';
import Button from 'sf/components/Button';
import adminModel from 'apps/admin/models/admin';

class AdminPageHeader extends BaseComponent {
  className = 'ts-AdminPageHeader';

  static propTypes = {
    showDetailsLabel: PropTypes.bool,
  };

  state = {}

  componentDidMount() {
    this.syncStateWithModel(adminModel, ['username', 'isSignedIn', 'role']);
  }

  handleLogOutButton = () => {
    // eslint-disable-next-line
    if (window.confirm('Do you really want to log out?')) {
      adminModel.logOut();
    }
  }

  renderSignedInArea() {
    const { role, isSignedIn } = this.state;
    const roleAddon = role
      ? <em className={ this.cn`__account-role` }>({ role.replace(/_/g, ' ').toLowerCase() })</em>
      : null;

    if (!isSignedIn) return null;

    const blackListItem = role === 'ROLE_MANAGER'
      ? (
        <div key="pass" className={ this.cn`__account-change-password` }>
          <Link
            to={ `/${ADMIN_URL_PREFIX}manage-negative-list.html` }
          >
            Manage negative list
          </Link>
        </div>
      )
      : null;

    return [
      <div key="welcome" className={ this.cn`__account-username` }>
        Welcome { this.state.username } { roleAddon }
      </div>,
      blackListItem,
      <div key="pass" className={ this.cn`__account-change-password` }>
        <Link
          to={ `/${ADMIN_URL_PREFIX}admin-change-password.html` }
        >
          Change password
        </Link>
      </div>,
      <div key="logout" className={ this.cn`__account-logout` }>
        <Button
          theme="link-unstyled"
          onClick={ this.handleLogOutButton }
        >
          Log Out
        </Button>
      </div>,
    ];
  }

  render() {
    return (
      <div className={ this.rootcn() }>
        <div className={ this.cn`__top-bar` }>
          <div className="ts-container ts-container--wide">
            <div className={ this.cn`__brand-name` }>
              Administration
            </div>
            <div className={ this.cn`__account-actions` }>
              { this.renderSignedInArea() }
            </div>
          </div>
        </div>
        <div className={ this.cn`__breadcrumbs` }>
          <div className="ts-container ts-container--wide">
            <ol className={ this.cn`__breadcrumbs-list` }>
              <li className={ this.cn`__breadcrumbs-item __breadcrumbs-item-link` }>
                <Link
                  className={ this.cn`__breadcrumbs-link` }
                  to={ `/${ADMIN_URL_PREFIX}admin-authentications.html` }
                >
                  Authentications
                </Link>
              </li>
              { this.props.showDetailsLabel &&
                <li className={ this.cn`__breadcrumbs-item` }>
                  Details
                </li>
              }
            </ol>
          </div>
        </div>
      </div>
    );
  }
}
export default AdminPageHeader;
