import React from 'react';
import PropTypes from 'prop-types';
import BaseComponent from 'components/BaseComponent';
import Dialog from 'sf/components/Dialog';
import PillButton from 'sf/components/PillButton';
import Render from 'sf/components/Render';

export default class DrivingLicence extends BaseComponent {
  className = 'ts-DrivingLicence';

  static propTypes = {
    back: PropTypes.string,
    front: PropTypes.string,
    isSelfieMismatched: PropTypes.bool,
    mode: PropTypes.oneOf(['simple', 'full']),
    portrait: PropTypes.string,
  };

  static defaultProps = {
    isSelfieMismatched: false,
    mode: 'simple',
  };

  state = {
    visibleSide: this.props.front ? 'front' : 'back',
  }

  handleFlipButtonClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    switch (this.state.visibleSide) {
      case 'front':
        this.setState({
          visibleSide: 'back',
        });
        break;
      case 'back':
        this.setState({
          visibleSide: 'front',
        });
        break;
      default:
        break;
    }
  }

  handleZoomButtonClick = (event) => {
    event.preventDefault();
    this.refs.zoom.toggle(true);
  }

  renderFullView() {
    if (!this.props.front && !this.props.back) { return null; }
    const classNames = {
      '--is-back-visible': this.state.visibleSide === 'back',
      '--is-selfie-mismatched': this.props.isSelfieMismatched,
    };
    return (
      <div className={ this.rootcn(classNames) }>
        <div className={ this.cn`__wrapper` }>
          <Render when={ this.props.front }>
            <div
              className={ this.cn`__front` }
              onClick={ this.handleZoomButtonClick }
              role="button"
              tabIndex={ 0 }
            >
              <Render when={ this.props.back }>
                <div className={ this.cn`__flip-button` }>
                  <PillButton
                    icon="ios-undo"
                    onClick={ this.handleFlipButtonClick }
                    type="success"
                  >
                    Flip
                  </PillButton>
                </div>
              </Render>
              <img src={ this.props.front } alt="" />
            </div>
          </Render>
          <Render when={ this.props.back }>
            { /* eslint-disable jsx-a11y/href-no-hash */ }
            <a
              className={ this.cn`__back` }
              href="#"
              /* eslint-enable */
              onClick={ this.handleZoomButtonClick }
            >
              <Render when={ this.props.front }>
                <div className={ this.cn`__flip-button` }>
                  <PillButton
                    icon="ios-redo"
                    onClick={ this.handleFlipButtonClick }
                    type="success"
                  >
                    Flip
                  </PillButton>
                </div>
              </Render>
              <img src={ this.props.back } alt="" />
            </a>
          </Render>
        </div>
        <Dialog
          ref="zoom"
          size="medium"
          title={ `Driving licence - ${this.state.visibleSide}` }
        >
          <div className={ this.cn`__dialog-image` }>
            <img src={ this.props[this.state.visibleSide] } alt="" />
          </div>
        </Dialog>
      </div>
    );
  }

  renderSimpleView() {
    const classNames = {
      '--is-selfie-mismatched': this.props.isSelfieMismatched,
    };
    return (
      <div className={ this.rootcn(classNames) }>
        <div className={ this.cn`__wrapper` }>
          <div className={ this.cn`__placeholder` }>
            <div className={ this.cn`__portrait` }>
              <Render when={ this.props.portrait }>
                <img src={ this.props.portrait } alt="" />
              </Render>
            </div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    switch (this.props.mode) {
      case 'full':
        return this.renderFullView();
      case 'simple':
        return this.renderSimpleView();
      default:
        return null;
    }
  }
}
