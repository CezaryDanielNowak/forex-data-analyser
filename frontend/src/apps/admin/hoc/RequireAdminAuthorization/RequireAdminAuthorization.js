import React from 'react';
import { ADMIN_URL_PREFIX } from 'apps/admin/config';
import BaseComponent from 'components/BaseComponent';
import adminModel from 'apps/admin/models/admin';

export default function (ComposedComponent) {
  return class AdminAuthorization extends BaseComponent {
    className = 'ts-AdminAuthorization';

    state = {
      isSignedIn: null,
    };

    checkAuthorization = (state) => {
      if (!state.isSignedIn) {
        const next = this.props.route.path || '';
        this.navigate(
          `/${ADMIN_URL_PREFIX}admin.html#next=${encodeURIComponent(next)}`,
          'push'
        );
      }
    }

    componentDidMount() {
      this.syncStateWithModel(adminModel, ['isSignedIn']).then(() => {
        this.checkAuthorization(this.state);
      });
    }

    componentWillUpdate(nextProps, nextState) {
      this.checkAuthorization(nextState);
    }

    render() {
      if (this.state.isSignedIn) return <ComposedComponent { ...this.props } />;
      return null;
    }
  };
}
