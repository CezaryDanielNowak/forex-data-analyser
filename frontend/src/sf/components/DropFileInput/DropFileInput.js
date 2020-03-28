import React from 'react';
import first from 'lodash/first';
import flatten from 'lodash/flatten';
import is from 'next-is';
import noop from 'no-op';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
import BaseComponent from 'components/BaseComponent';
import Icon from 'sf/components/Icon';

const ACCEPT_CONFIG = {
  IMAGE: [
    'image/gif',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/svg+xml',
  ],
  VIDEO: [
    'video/mp4',
    'video/ogg',
    'video/webm',
  ],
  PDF: ['application/pdf'],
};

export const ACCEPT_TYPES = Object.keys(ACCEPT_CONFIG)
  .reduce((acc, key) => ({
    ...acc,
    [key]: key,
  }), {});

export default class DropFileInput extends BaseComponent {
  className = 'ts-DropFileInput';

  static propTypes = {
    accept: PropTypes.arrayOf(PropTypes.string),
    allowPreview: PropTypes.bool,
    displayName: PropTypes.node,
    extraText: PropTypes.node,
    isOptional: PropTypes.bool,
    multiple: PropTypes.bool,
    stateLink: PropTypes.array,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    accept: null,
    allowPreview: true,
    displayName: null,
    extraText: null,
    isOptional: false,
    multiple: false,
    onChange: noop,
  };

  state = {};

  getAcceptTypes = () => {
    const { accept } = this.props;
    if (!Array.isArray(accept)) return null;

    return flatten(
      Object.entries(ACCEPT_CONFIG)
        .filter(([type]) => accept.includes(type))
        .map(([, mimes]) => (mimes))
    ).join(', ');
  }

  handleDrop = (acceptedFiles) => {
    const [context, stateField] = this.props.stateLink;

    const setStateCallback = () => {
      this.props.onChange(acceptedFiles);
      this.setState({
        files: acceptedFiles
      });
    };

    const newValue = this.props.multiple ? acceptedFiles : first(acceptedFiles);

    if (context) {
      context.setState(() => ({
        [stateField]: newValue,
      }), setStateCallback);
    } else {
      setStateCallback();
    }
  };

  open = () => this.dropzone.open(); // public

  render() {
    const { allowPreview, displayName, extraText, isOptional } = this.props;
    const { files } = this.state;
    const isMobile = is.mobile();
    const dropzoneClassNames = {
      '__dropzone': true,
      '__dropzone--hidden': isMobile,
    };
    const extraTextClassNames = {
      '__extra-text': true,
      '__extra-text--mobile': isMobile,
    };
    return (
      <div
        className={ this.rootcn() }
      >
        { displayName &&
          <label
            htmlFor={ `${this.className}-${this.componentId}` }
            className={ this.cn`__label` }
          >
            { displayName }
            { isOptional &&
              <span className={ this.cn`__label-optional` }>
                { ' (optional)' }
              </span> }
          </label> }
        <div
          className={ this.cn`__row` }
        >
          <Dropzone
            accept={ this.getAcceptTypes() }
            className={ this.cn(dropzoneClassNames) }
            id={ `${this.className}-${this.componentId}` }
            multiple={ this.props.multiple }
            ref={ (dropzone) => { this.dropzone = dropzone; } }
            onDrop={ this.handleDrop }
          >
            <div
              className={ this.cn`__dropzone-content` }
            >
              <Icon
                className={ this.cn`__dropzone-content-icon` }
                set="io"
                size={ 43 }
                type="ios-cloud-upload-outline"
              />
              <span
                className={ this.cn`__dropzone-content-text` }
              >
                Drag file or browse
              </span>
            </div>
          </Dropzone>
          { extraText &&
            <div
              className={ this.cn(extraTextClassNames) }
            >
              { extraText }
            </div> }
        </div>
        { allowPreview &&
          files &&
          files.length &&
          files.map(({ name, preview }) => (
            <img
              alt="Upload preview"
              className={ this.cn`__preview` }
              key={ name }
              src={ preview }
            />
          )) }
      </div>
    );
  }
}
