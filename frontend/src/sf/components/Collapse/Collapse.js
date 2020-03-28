import React from 'react';
import noop from 'no-op';
import PropTypes from 'prop-types';
import AnimateHeight from 'react-animate-height';
import BaseComponent from 'components/BaseComponent';
import IconButton from 'sf/components/IconButton';

export default class Collapse extends BaseComponent {
  className = 'ts-Collapse';

  static propTypes = {
    children: PropTypes.node,
    collapsedHeight: PropTypes.number,
    disabled: PropTypes.bool,
    initiallyCollapsed: PropTypes.bool,
    showButton: PropTypes.bool,
    stateLink: PropTypes.array,
    onToggle: PropTypes.func,
  };

  static defaultProps = {
    children: '',
    collapsedHeight: 48,
    disabled: false,
    initiallyCollapsed: false,
    showButton: true,
    onToggle: noop,
  };

  state = {
    collapsed: this.props.initiallyCollapsed,
  }

  handleButtonClick = () => this.toggle();

  handleWrapperClick = () => {
    if (!this.state.collapsed) return;
    this.show();
  }

  hide = () => this.toggle(true);

  show = () => this.toggle(false);

  toggle = (forcedValue) => this.setState(
    ({ collapsed }) => ({
      collapsed: typeof forcedValue === 'boolean' ? forcedValue : !collapsed,
    }),
    () => {
      const callback = () => this.props.onToggle(this.state.collapsed);
      if (!this.props.stateLink) {
        callback();
        return;
      }
      const [context, prop] = this.props.stateLink;
      context.setState(
        {
          [prop]: this.state.collapsed,
        },
        callback,
      );
    }
  );

  render() {
    const { collapsed } = this.state;
    const { collapsedHeight, disabled } = this.props;
    const classNames = {
      '--collapsed': collapsed && !disabled,
      '--disabled': disabled,
    };
    const buttonClassNames = {
      '__button-icon': true,
      '__button-icon--collapsed': collapsed,
    };
    const wrapperClassName = {
      '__wrapper': true,
      '__wrapper--collapsed': collapsed,
    };
    return (
      <AnimateHeight
        className={ this.rootcn(classNames) }
        duration={ 500 }
        height={ collapsed && !disabled ? collapsedHeight : 'auto' }
      >
        <div
          className={ this.cn(wrapperClassName) }
          onClick={ this.handleWrapperClick }
          role="button"
          tabIndex={ 0 }
        >
          { this.props.showButton && !disabled &&
            <span className={ this.cn`__button` }>
              <span
                className={ this.cn`__button-caption` }
                onClick={ this.handleButtonClick }
                role="button"
                tabIndex={ 0 }
              >
                { collapsed ? 'Reveal' : 'Hide' }
              </span>
              <IconButton
                className={ this.cn(buttonClassNames) }
                onClick={ this.handleButtonClick }
                set="ts"
                type="circle-chevron-up"
              />
            </span> }
          { this.props.children }
        </div>
      </AnimateHeight>
    );
  }
}
