import React from 'react';
import atom from 'atom-js';
import noop from 'no-op';
import PropTypes from 'prop-types';
import { loadScriptPool } from 'sf/helpers';
import { getScript } from 'sf/helpers/domHelper';

import BaseComponent from 'components/BaseComponent';
import model from './model';

export class Captcha extends BaseComponent {
  className = 'ts-Captcha';

  static propTypes = {
    captchaUrl: PropTypes.string,
    delayedStartTime: PropTypes.number,
    language: PropTypes.string,
    onExpired: PropTypes.func,
    showLoading: PropTypes.bool,
    sitekey: PropTypes.string, // when sitekey provided then `captchaUrl` is not needed
    verificationCallback: PropTypes.func,
  };

  static defaultProps = {
    delayedStartTime: 0,
    language: 'en',
    onExpired: noop,
    showLoading: true,
    verificationCallback: noop,
  };

  componentDidMount() {
    if (this.props.delayedStartTime) {
      // Delayed start is useful to fix a problem on iOS when after rapid page refreshes,
      // user is redirected to google.com.
      // How it works:
      // - captcha is initialised after requested time, not right away
      // or
      // - captcha is initialised when any input changes (interaction with a user)
      this.addEventListener(window, 'change', () => {
        this.initCaptcha();
      });

      this.setTimeout(() => {
        this.initCaptcha();
      }, this.props.delayedStartTime);
    } else {
      this.initCaptcha();
    }
  }

  componentWillUnmount() {
    model.resetCaptcha();
    super.componentWillUnmount();
  }

  initCaptcha() {
    if (this.captchaInitialised) return;

    this.captchaInitialised = true;
    const { sitekey, captchaUrl, language, showLoading } = this.props;
    const newModelData = {
      language,
      showLoading,
    };
    if (captchaUrl) newModelData.captchaUrl = captchaUrl;
    if (sitekey) newModelData.sitekey = sitekey;

    model.set(newModelData);

    if (sitekey) {
      this.createCaptcha();
    } else {
      model.need('sitekey', this.createCaptcha);
    }
  }

  createCaptcha = async (sitekeyFromEndpoint) => {
    // callback might be called with a delay
    if (this.isDestroyed || !this.refs.captcha) return;
    const sitekey = sitekeyFromEndpoint || this.props.sitekey;

    await loadScriptPool('grecaptcha.render', () => {
      // hl = language https://developers.google.com/recaptcha/docs/language
      getScript(`//www.google.com/recaptcha/api.js?render=explicit&hl=${model.get('language')}`);
    });

    /* istanbul ignore next */
    global.grecaptcha.render(this.refs.captcha, {
      'callback': this.props.verificationCallback,
      'expired-callback': this.handleExpired,
      'sitekey': sitekey,
    });
  };

  handleExpired = () => {
    this.props.onExpired();
  }

  render() {
    return (
      <div className={ this.rootcn`` }>
        <div ref="captcha" />
      </div>
    );
  }
}

export default atom.reactConnect(model, [
  'sitekey'
])(Captcha);
