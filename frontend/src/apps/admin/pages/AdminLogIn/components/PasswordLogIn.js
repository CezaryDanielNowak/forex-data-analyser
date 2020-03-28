import React from 'react';
import adminModel from 'apps/admin/models/admin';
import BaseComponent from 'components/BaseComponent';
import Button from 'sf/components/Button';
import ValidationInput from 'sf/components/ValidationInput';

export default class PasswordLogIn extends BaseComponent {
  className = 'ts-PasswordLogIn';

  state = {
    loginError: false,
    email: '',
    password: ''
  }

  componentDidMount() {
    this.addEventListener(window, 'keypress', (e) => {
      if (e.key === 'Enter') {
        this.handleSubmit(e);
      }
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({ loginError: false });
    this.formValidation(
      adminModel, 'form.'
    ).then(() => {
      adminModel.logIn(
        adminModel.get('username'),
        adminModel.get('password')
      ).then(() => {
        this.adminNavigate('admin-authentications.html');
      }).catch((err) => {
        this.setState({ loginError: err });
      });
    });
  }

  renderLoginError() {
    if (!this.state.loginError) return null;

    if (this.state.loginError === 'ERROR_NETWORK_OFFLINE') {
      return (
        <div className={ this.cn`__login-error` }>
          Network offline. Try again later.
        </div>
      );
    }

    return (
      <div className={ this.cn`__login-error` }>
        Wrong credentials. Try again.
      </div>
    );
  }

  render() {
    return (
      <div className={ this.rootcn() }>
        <form
          className={ this.cn`__form` }
          onSubmit={ this.handleSubmit }
        >
          <div className="grid">
            <ValidationInput
              ref="form.username"
              autoFocus={ true }
              className="col-preserve-1-1"
              displayName="Email Address"
            />
          </div>
          <div className="grid">
            <ValidationInput
              ref="form.password"
              className="col-preserve-1-1"
              type="password"
              displayName="Password"
            />
          </div>
          { this.renderLoginError() }
        </form>
        <Button
          mainAction={ true }
          onClick={ this.handleSubmit }
        >
          Log In
        </Button>
      </div>
    );
  }
}
