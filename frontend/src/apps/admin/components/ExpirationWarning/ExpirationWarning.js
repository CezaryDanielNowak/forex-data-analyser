import React from 'react';
import BaseComponent from 'components/BaseComponent';
import InlineTimer from 'sf/components/InlineTimer';
import Button from 'sf/components/Button';

import adminModel from 'apps/admin/models/admin';

// 5 minutes
const TIME_BEFORE_END = 5 * 60 * 1000;

export default class ExpirationWarning extends BaseComponent {
  className = 'ts-ExpirationWarning';

  state = { token_expiration_time: '' };

  tokenExtendableHandler = (token_extendable) => {
    this.setState({ token_extendable });
  }

  tokenExpirationHandler = (token_expiration_time) => {
    this.setState({ token_expiration_time });
    clearInterval(this.interval);

    this.interval = setInterval(() => {
      if (
        !token_expiration_time
        || token_expiration_time - Date.now() > TIME_BEFORE_END
      ) {
        return null;
      }

      this.publish('showHelp', {
        title: 'Session Timeout',
        content: this.renderMessageContents(),
      });

      clearInterval(this.interval);
    }, 5000);
  }

  handleTokenExpiration() {
    adminModel.on('token_expiration_time', this.tokenExpirationHandler);
    adminModel.on('token_extendable', this.tokenExtendableHandler);
  }

  componentWillUnmount() {
    adminModel.off('token_expiration_time', this.tokenExpirationHandler);
    adminModel.off('token_extendable', this.tokenExtendableHandler);

    clearInterval(this.interval);
    super.componentWillUnmount();
  }

  componentWillMount() {
    this.handleTokenExpiration();
  }

  handleLogOut = () => {
    adminModel.logOut();
    this.publish('hideHelp');
  }

  renderMessageContents() {
    const { token_expiration_time, token_extendable } = this.state;

    return (
      <div
        className={ this.rootcn() }
      >
        Your session will expire in { '' }
        <InlineTimer
          date={ token_expiration_time }
          finishCallback={ this.handleLogOut }
        />.

        <br />
        <br />

        <Button
          onClick={ this.handleLogOut }
          outlined={ true }
          theme={ token_extendable ? 'link' : 'accent' }
          type="button"
        >
          { token_extendable ? 'Log Out' : 'Log Out Now' }
        </Button>
        { token_extendable ?
          <Button
            className={ this.cn`__extend-button` }
            theme="accent"
            type="button"
            onClick={ () => {
              adminModel.getPasswordExpiration(); // little trick to extend session.
              this.publish('hideHelp');
            } }
          >
            Extend Session
          </Button>
          : null
        }
      </div>
    );
  }

  render() {
    return null;
  }
}
