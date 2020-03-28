import React from 'react';
import PropTypes from 'prop-types';
import BaseComponent from 'components/BaseComponent';
import Img from 'sf/components/Img';

const EMPTY_SRC = 'data:image/gif;base64,';
const FADEOUT_TIME = 500;

export default class GifPlayer extends BaseComponent {
  className = 'ts-GifPlayer';

  visibilityTimeout;
  srcTimeout;

  img;

  static propTypes = {
    delay: PropTypes.number,
    src: PropTypes.string.isRequired,
  };

  static defaultProps = {
    delay: 5000,
  };

  state = {
    src: EMPTY_SRC,
    visible: false,
    rendered: false,
  };

  componentDidMount() {
    this.img = new Image();
    this.img.onload = function () {
      this.src = EMPTY_SRC;
    };
    this.img.src = this.props.src;
  }

  componentWillUnmount() {
    clearTimeout(this.visibilityTimeout);
    clearTimeout(this.srcTimeout);
    super.componentWillUnmount();
    if (this.img) this.img.remove();
    delete this.img;
  }

  hideGif = () => { // public
    clearTimeout(this.visibilityTimeout);
    clearTimeout(this.srcTimeout);
    this.setState({ visible: false });
    this.srcTimeout = setTimeout(() => this.setState({
      rendered: false,
      src: EMPTY_SRC,
    }), FADEOUT_TIME);
  };

  showGif = () => { // public
    this.setState({
      rendered: true,
      src: this.props.src,
      visible: true,
    }, () => {
      this.visibilityTimeout = setTimeout(() => this.setState({
        visible: false,
      }), Math.max(this.props.delay - FADEOUT_TIME, 0));
      this.srcTimeout = setTimeout(() => this.setState({
        src: EMPTY_SRC,
        redered: false,
      }), this.props.delay);
    });
  }

  render() {
    return (
      <Img
        className={ this.rootcn({
          '--visible': this.state.visible,
        }) }
        src={ this.state.src }
      />
    );
  }
}
