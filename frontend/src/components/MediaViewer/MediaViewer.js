import React from 'react';
import noop from 'no-op';
import PropTypes from 'prop-types';
import ReactPlayer from 'react-player';
import BaseComponent from 'components/BaseComponent';
import IconButton from 'components/IconButton';

export default class MediaViewer extends BaseComponent {
  className = 'ts-MediaViewer';

  static propTypes = {
    fileUrl: PropTypes.string.isRequired,
    viewerType: PropTypes.oneOf(['image', 'video']),
    onClose: PropTypes.func
  };

  static defaultProps = {
    fileUrl: null,
    viewerType: 'image',
    onClose: noop,
  };

  componentDidMount() {
    this.addEventListener(window, 'keyup', this.handleEscKey);
    this.addEventListener(window, 'mousedown', this.handleOutsideClick);
    this.addEventListener(window, 'touchend', this.handleOutsideClick);
  }

  componentWillUnmount() {
    document.body.classList.remove('scroll--disabled');
  }

  handleEscKey = (e) => {
    if (e.keyCode === 27) {
      this.close();
    }
  };

  handleCloseButton = () => {
    this.close();
  }

  handleOutsideClick = (e) => {
    if (this.mediaObjectContainer && !this.mediaObjectContainer.contains(e.target)) {
      this.close();
    }
  }

  close = () => {
    document.body.classList.remove('scroll--disabled');
    this.props.onClose();
  }

  render() {
    const { fileUrl, viewerType } = this.props;
    document.body.classList.add('scroll--disabled');
    return (
      <div
        className={ this.rootcn`` }
        ref={ (el) => { this.rootElement = el; } }
      >
        <div className={ this.cn`__viewer-container` }>
          <div
            className={ this.cn`__media-object-container` }
            ref={ (el) => { this.mediaObjectContainer = el; } }
          >
            { viewerType === 'video' ? (
              <ReactPlayer
                className={ this.cn`__media-object` }
                controls={ true }
                url={ fileUrl }
                width="auto"
                height="auto"
              />
            ) : (
              <img
                alt=""
                src={ fileUrl }
                className={ this.cn`__media-object` }
              />
            ) }
            <div className={ this.cn`__media-object-options-panel` }>
              <IconButton
                className={ this.cn`__close-button` }
                type="close"
                iconSize={ 20 }
                theme="action"
                size="big"
                onClick={ this.handleCloseButton }
              >
                Close
              </IconButton>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
