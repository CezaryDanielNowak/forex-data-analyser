// libs
import debounce from 'lodash/debounce';
import PropTypes from 'prop-types';
import React from 'react';

// components
import BaseComponent from 'components/BaseComponent';
import FloatingText from 'components/FloatingText';
import GlobalLoader from 'sf/components/GlobalLoader';
import Help from 'sf/components/Help';
import MediatorAlert from 'sf/components/MediatorAlert';

// helpers
import { blockPageInTransition } from 'sf/helpers/domHelper';


/*
 * React router renders component inside root component (App), even if route is nested.
 * This method helps to create nested components tree.
 */
const getParentComponent = (componentName, parentRoute) => {
  return parentRoute.childRoutes.find((route) => {
    if (route.childRoutes) {
      return getParentComponent(componentName, route);
    }

    return route.path === componentName;
  });
};

export default class App extends BaseComponent {
  className = 'ts-MainLayout';

  static propTypes = {
    children: PropTypes.node,
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.location.pathname !== (this.props.location || {}).pathname) {
      this.publish('locationChange');
    }
  }

  componentDidMount() {
    this.subscribe('showHelp', debounce((payload) => {
      if (!payload) {
        throw new Error('empty payload passed to showHelp!');
      }
      if (payload.tutorialError) {
        throw new Error('tutorialError message should be handled by Tutorial component!');
      }
      this.refs.help.show(payload);
    }, 50));
    this.subscribe('hideHelp', () => this.refs.help.hide());
    this.subscribe('locationChange', () => {
      blockPageInTransition();
      this.refs.help.hide();
    });

    // NOTE:
    // When dialog is showed up, floating text shows inside an active dialog!
    this.subscribe('showFloatingText', (payload) => {
      if (ENV === 'local' && !payload.text) {
        // eslint-disable-next-line no-console
        console.warn('[DEBUG] Provide payload.text to `showFloatingText` event');
      }
      this.refs.floatingText.showFloatingText(payload);
    });
  }

  renderChildren() {
    const parentComponentRoute = getParentComponent(this.props.params.splat, this.props.route);
    const ParentComponent = parentComponentRoute ? parentComponentRoute.component : null;
    if (ParentComponent) {
      return (
        <ParentComponent>
          { this.props.children }
        </ParentComponent>
      );
    }

    return this.props.children;
  }

  // returns matching route first parent's` layout` attribute
  getLayout() {
    return this.props.routes.filter((route) => route.layout).pop().layout;
  }

  getAppBody() {
    return (
      <div>
        <FloatingText ref="floatingText" />
        <Help ref="help" />
        <div className="ts-container">
          <MediatorAlert listenTopic="error" closeTopic="locationChange" theme="danger" />
          <MediatorAlert listenTopic="warning" closeTopic="locationChange" theme="warning" />
          <MediatorAlert listenTopic="info" closeTopic="locationChange" theme="info" />
          <MediatorAlert listenTopic="success" closeTopic="locationChange" theme="success" />
        </div>
        <GlobalLoader />
        { this.renderChildren() }
      </div>
    );
  }

  render() {
    const { className } = this.props.route;
    const layout = this.getLayout();
    return React.createElement(layout, { ...this.props, className }, this.getAppBody());
  }
}
