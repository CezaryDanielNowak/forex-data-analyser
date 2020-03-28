import React from 'react';
import omit from 'lodash/omit';
import BaseComponent from 'components/BaseComponent';
import IconButton from 'sf/components/IconButton';

export default function withPasswordTypeToggler(ComposedComponent) {
  return class PasswordTypeToggler extends BaseComponent {
    className = 'ts-PasswordTypeToggler';

    constructor(props) {
      super(props);
      this.state = {
        type: props.type,
      };
    }

    getClickHandler = (type) => () => this.setState({ type });

    setValid = (...args) => this.refs.component.setValid(...args);

    render() {
      if (this.props.type !== 'password') return <ComposedComponent { ...this.props } />;

      return (
        <div className={ this.rootcn() }>
          <ComposedComponent
            { ...omit(this.props, ['type']) }
            ref="component"
            type={ this.state.type }
          />
          <IconButton
            buttonType="button"
            className={ this.cn({
              '__button': true,
              '__button--visible': this.state.type === 'password'
            }) }
            iconSize={ 22 }
            set="io"
            tabIndex="-1"
            type="eye"
            onClick={ this.getClickHandler('text') }
          />
          <IconButton
            buttonType="button"
            className={ this.cn({
              '__button': true,
              '__button--visible': this.state.type === 'text'
            }) }
            iconSize={ 22 }
            set="io"
            tabIndex="-1"
            type="eye-disabled"
            onClick={ this.getClickHandler('password') }
          />
        </div>
      );
    }
  };
}
