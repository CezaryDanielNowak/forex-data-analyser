import React from 'react';

import BaseComponent from 'components/BaseComponent';
import PageTitle from 'components/PageTitle';
import { PROCESSING } from 'sf/l10n';
import Spinner from 'sf/components/Spinner';
import { renderTemplate } from 'sf/helpers/react';


export default class ProcessingScreen extends BaseComponent {
  className = 'ts-ProcessingScreen';

  componentWillUnmount() {
    this.unlockGlobalLoader();
    super.componentWillUnmount();
  }

  componentDidMount() {
    this.blockGlobalLoader();
  }

  blockGlobalLoader = () => {
    this.unlockGlobalLoader();

    this.globalLoaderBlocker = document.createElement('style');
    this.globalLoaderBlocker.innerText = '.ts-GlobalLoader { display: none !important; }';
    document.body.appendChild(this.globalLoaderBlocker);
  }

  unlockGlobalLoader = () => {
    const { globalLoaderBlocker } = this;
    if (globalLoaderBlocker) {
      globalLoaderBlocker.parentNode.removeChild(globalLoaderBlocker);
      this.globalLoaderBlocker = null;
    }
  }


  render() {
    return (
      <div className={ this.rootcn('ts-container ts-container--narrow') }>
        <PageTitle className="ts-center" title={ renderTemplate(`&nbsp; ${PROCESSING}`)() } />

        <div className={ this.cn`__spinner-container` }>
          <Spinner className="ts-center" size={ 60 } />
        </div>
      </div>
    );
  }
}
