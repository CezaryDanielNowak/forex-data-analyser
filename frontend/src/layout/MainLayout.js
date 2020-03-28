import React from 'react';
import PropTypes from 'prop-types';

import BaseComponent from 'components/BaseComponent';
import PageHeader from 'components/PageHeader';

class MainLayout extends BaseComponent {
  className = 'ts-MainLayout';

  static propTypes = {
    children: PropTypes.node,
    description: PropTypes.string,
  };

  static defaultProps = {
    description: '',
  };

  render() {
    const layoutClassName = {};
    const contentClassName = {
      '__content': true
    };

    return (
      <div className={ this.rootcn(layoutClassName) }>
        <PageHeader />
        <div className={ this.cn(contentClassName) }>
          { this.props.children }
        </div>
      </div>
    );
  }
}

export default MainLayout;
