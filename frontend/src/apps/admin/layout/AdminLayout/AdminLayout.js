import React from 'react';
import PropTypes from 'prop-types';
import BaseComponent from 'components/BaseComponent';
import AdminPageHeader from 'apps/admin/components/AdminPageHeader';

export default class AdminLayout extends BaseComponent {
  className = 'ts-AdminLayout';

  static propTypes = {
    children: PropTypes.node,
  };

  render() {
    const layoutClassName = {};

    return (
      <div className={ this.rootcn(layoutClassName) }>
        <AdminPageHeader
          showDetailsLabel={ this.props.location.pathname
            .includes('admin-authentications-details')
          }
        />
        <div className="ts-container ts-container--wide">
          { this.props.children }
        </div>
      </div>
    );
  }
}
