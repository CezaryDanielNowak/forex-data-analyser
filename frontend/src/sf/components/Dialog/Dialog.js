import React from 'react';
import last from 'lodash/last';
import noop from 'no-op';
import PropTypes from 'prop-types';
import ResizeObserver from 'react-resize-observer';
import ReactModal from 'react-modal';
import BaseComponent from 'components/BaseComponent';
import deviceModel from 'sf/models/device';
import FloatingText from 'sf/components/FloatingText';
import Icon from 'sf/components/Icon';
import {
  createCustomEvent,
  getWindowHeight,
  takeControlOverWindow,
} from 'sf/helpers/domHelper';

const CSS_CLOSE_ANIMATION_DURATION = 550;
const CSS_OPEN_ANIMATION_DURATION = 800;

const dialogStack = [];
const DialogText = ({ children }) => (
  <div className="ts-DialogText">
    { children }
  </div>
);

DialogText.propTypes = {
  children: PropTypes.node,
};

DialogText.defaultProps = {
  children: null,
};

const DialogFooter = ({ children }) => (
  <div className="ts-DialogFooter">
    { children }
  </div>
);

DialogFooter.propTypes = {
  children: PropTypes.node,
};

DialogFooter.defaultProps = {
  children: null,
};

export {
  DialogText,
  DialogFooter,
};

export default class Dialog extends BaseComponent {
  className = 'ts-Dialog';

  state = {
    // Used to 'softly' hide the dialog and display something full-screen (e.g. Webcam)
    cssVisibility: null,
    floatingText: null,
    isClosing: false,
    isFloatingTextValid: true,
    isFloatingTextVisible: false,
    shouldDialogScroll: false,
    // After initial prop passed, `visible` is not controllable. This is a feature.
    visible: this.props.visible,
  };

  static propTypes = {
    children: PropTypes.node,
    closable: PropTypes.bool,
    closeIconSet: PropTypes.string,
    closeIconType: PropTypes.string,
    fullScreenCloseIconSize: PropTypes.number,
    size: PropTypes.oneOf(['small', 'medium', 'large', 'xlarge', 'xxlarge']),
    title: PropTypes.string,
    hiddenTitle: PropTypes.bool,
    visible: PropTypes.bool,
    windowedCloseIconSize: PropTypes.number,
    onDismiss: PropTypes.func,
  };

  static defaultProps = {
    children: '',
    closable: true,
    closeIconSet: 'ts',
    closeIconType: 'close',
    fullScreenCloseIconSize: 14,
    size: 'large',
    visible: false,
    windowedCloseIconSize: 20,
    onDismiss: noop,
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.visible && !this.state.visible) {
      this.toggle(true);
    }
  }

  componentDidUpdate() {
    // trigger handleWindowResize not directly but by calling a window resize event
    // window resize event is required sometimes for components placed as a dialog content
    const event = createCustomEvent('resize');
    window.dispatchEvent(event);
  }

  componentDidMount() {
    this.syncStateWithModel(deviceModel, ['smDown', 'xsmUp', 'smUp', 'mdUp']);
    this.subscribe('showFloatingText--dialog', (textProps) => {
      if (this.state.visible) {
        this.showFloatingText(textProps);
      }
    });
    this.subscribe('imageToCropLoaded', this.setPositionAndSize);
    this.addEventListener(document, 'touchmove', this.handleTouchmove);
    this.addEventListener(window, 'resize', this.handleWindowResize);
  }

  componentWillUnmount() {
    // in case, Dialog is removed from the document
    // It might happen on redirections
    document.body.classList.remove('scroll--disabled');
    super.componentWillUnmount();
    this.removeWindowControl();
  }

  addToStack = () => {
    this.removeFromStack();
    dialogStack.push(this.componentId);
  };

  removeFromStack = () => {
    const indexOfCurrentDialog = dialogStack.indexOf(this.componentId);
    if (indexOfCurrentDialog > -1) {
      dialogStack.splice(indexOfCurrentDialog, 1);
    }
  };

  handleWindowResize = () => {
    if (!this.state.visible) return;
    this.setPositionAndSize();
  }

  scrollToTop() {
    this.scrollableContainerNode.scrollTop = 0;
  }

  setPositionAndSize = () => {
    // calculate dialog content height and enable/disable scroll mode
    if (this.scrollableContainerNode && this.state.visible) {
      const topOffset = Math.floor(
        (getWindowHeight() - this.scrollableContainerNode.scrollHeight) / 2
      );
      this.setState({
        shouldDialogScroll: topOffset < 0,
        topOffset: topOffset > 0 ? topOffset : 0,
      });
    }
  }

  handleTouchmove = (event) => {
    if (last(dialogStack) !== this.componentId) return;
    if (!this.state.visible) return;
    if (this.state.shouldDialogScroll) return true;
    if (!(this.state.visible && this.state.smDown)) return true;
    event.preventDefault();
  }

  /**
   * Dismiss is the same as toggle(false) but also triggers ondismiss callback.
   */
  dismiss = () => {
    this.toggle(false, () => {
      this.props.onDismiss();
    });
  };

  removeWindowControl = () => {
    // eslint-disable-next-line no-unused-expressions
    this.windowControl && this.windowControl.remove();
    delete this.windowControl;
  }

  /**
   * show or hide dialog
   * @param  {Boolean} args[0]  show when true, hide when false
   * @param  {Fuction} args[1]  callback for show/hide
   */
  toggle(...args) { // public
    const [newVisibility, callback] = args;
    const isVisible = args.length ? newVisibility : !this.state.visible;

    this.removeWindowControl();
    if (isVisible && this.rootNode) {
      this.windowControl = takeControlOverWindow(this.rootNode);
    }

    if (isVisible) {
      this.addToStack(this.componentId);
    } else {
      this.removeFromStack(this.componentId);
    }

    if (dialogStack.length) {
      document.body.classList.add('scroll--disabled');
    } else {
      document.body.classList.remove('scroll--disabled');
    }

    this.setState({
      visible: isVisible,
    }, () => {
      this.setState(
        { inTransition: isVisible },
        () => {
          if (isVisible) {
            setTimeout(() => {
              // on touch devices multiple events are called on click, this might
              // cause dialog disapear right after showing up.
              this.setState({ inTransition: false });
            }, CSS_OPEN_ANIMATION_DURATION);
          }

          if (callback) callback();
        },
      );
    });
  }

  hide() {
    this.setState({ cssVisibility: 'hidden' });
  }

  show() {
    this.setState({ cssVisibility: null });
  }

  showFloatingText(textProps, callback) { // public
    const cb = () => {
      if (textProps.autoHide) {
        this.setState({ visible: false });
      }
      if (callback) callback();
    };
    return this.refs.floatingText.showFloatingText(textProps, cb);
  }

  handleClose = () => {
    this.toggle(false);
    // stop css closing animations
    this.setState({
      isClosing: false,
    });
    this.props.onDismiss();
  }

  handleCloseClick = (event) => {
    event.preventDefault();
    // wait for css animations to complete and prevent removing markup to soon
    this.setState({ 'isClosing': true }, () => {
      setTimeout(this.handleClose, CSS_CLOSE_ANIMATION_DURATION);
    });
  }

  getDesktopWidth() {
    switch (this.props.size) {
      case 'small':
        return 370;
      case 'medium':
        return 520;
      case 'xlarge':
        return 880;
      case 'xxlarge':
        return 1000;
      case 'large':
      default:
        return 670;
    }
  }

  getBreakPointName = () => {
    switch (this.props.size) {
      case 'xxlarge':
        return 'mdUp';
      case 'xlarge':
        return 'smUp';
      default:
        return 'xsmUp';
    }
  };

  getDialogWidth = () => this.state[this.getBreakPointName()] ? this.getDesktopWidth() : '100%';


  render() {
    const isTitleHidden = this.props.hiddenTitle;
    const closeButtonProperty = {
      top: isTitleHidden ? 24 : 30,
      right: isTitleHidden ? 40 : 30
    };

    const maskClosable = this.state.inTransition || !this.props.closable
      ? false
      : this.props.maskClosable;
    const className = {
      '--open': this.state.visible,
      '--in-transition': this.state.inTransition,
      '--xlarge': this.props.size === 'xlarge',
    };
    const overlayClassName = {
      '__overlay': true,
      '__overlay--before-close': this.state.isClosing,
      '__overlay--before-open': this.state.visible,
    };
    const contentClassName = {
      '__content--scrollable': this.state.shouldDialogScroll,
      '__content': !this.state.shouldDialogScroll,
      // disable dialog window animations in scrollable mode
      '__content--before-open': !this.state.shouldDialogScroll && this.state.visible,
      '__content--before-close': !this.state.shouldDialogScroll && this.state.isClosing,
    };

    return (
      <ReactModal
        ref={ this.createRef('rootNode') }
        isOpen={ this.state.visible }
        contentLabel="content"
        shouldCloseOnOverlayClick={ maskClosable }
        shouldCloseOnEsc={ this.props.closable }
        onRequestClose={ this.handleCloseClick } // overlay click only; button is ours
        portalClassName={ this.rootcn(className) }
        overlayClassName={ this.cn(overlayClassName) }
        className={ this.cn(contentClassName) }
        style={ { content: {
          top: this.state.topOffset,
          // center dialog window horizontaly when screen smUp
          marginLeft: this.state[this.getBreakPointName()] ? -1 * this.getDesktopWidth() / 2 : '0',
          left: this.state[this.getBreakPointName()] ? '50%' : '0',
          width: this.getDialogWidth(),
          visibility: this.state.cssVisibility,
        } } }
      >
        <ResizeObserver
          onResize={ () => {
            this.setPositionAndSize();
          } }
        />
        { this.props.closable &&
          <button
            className={ this.cn`__close-button` }
            onClick={ this.handleCloseClick }
            style={ {
              top: `${this.state[this.getBreakPointName()] ? closeButtonProperty.top : 20}px`,
              right: `${this.state[this.getBreakPointName()] ? closeButtonProperty.right : 20}px`,
            } }
          >
            <Icon
              set={ this.props.closeIconSet }
              size={
                this.state[this.getBreakPointName()]
                  ? this.props.fullScreenCloseIconSize
                  : this.props.windowedCloseIconSize
              }
              key="close"
              type={ this.props.closeIconType }
            />
          </button>
        }
        <div
          className={
            this.state.shouldDialogScroll ?
              this.cn`__scrollable-container` : null
          }
          ref={ this.createRef('scrollableContainerNode') }
        >
          { !this.props.hiddenTitle &&
            <div className={ this.cn`__header` }>
              { this.props.title ? (
                <div className={ this.cn`__title` }>
                  { this.props.title }
                </div>
              ) : null }
            </div>
          }
          <div className={ this.cn`__body` }>
            <FloatingText ref="floatingText" />
            { this.props.children }
          </div>
        </div>
      </ReactModal>
    );
  }
}
