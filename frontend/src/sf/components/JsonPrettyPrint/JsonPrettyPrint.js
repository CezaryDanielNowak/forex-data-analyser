import React from 'react';
import is from 'next-is';
import Prism from 'prismjs';
import 'prismjs/components/prism-json';
import PropTypes from 'prop-types';
import BaseComponent from 'components/BaseComponent';
import { asset, loadCssFile } from 'sf/helpers';

export default class JsonPrettyPrint extends BaseComponent {
  className = 'ts-JsonPrettyPrint';

  static propTypes = {
    content: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.object,
    ]),
  };

  static defaultProps = {
    content: '',
  };

  componentDidMount() {
    loadCssFile(asset`lib/prismjs/prism.css`);
  }

  render() {
    const { content } = this.props;
    let validJSON;
    switch (true) {
      case is.isString(content) && is.string.isJSON(content):
        validJSON = content;
        break;
      case is.isObject(content):
        try {
          validJSON = JSON.stringify(content, null, 2);
        } catch (e) {
          validJSON = '"Unable to convert the object to JSON"';
        }
        break;
      default:
        validJSON = `${content}`;
        break;
    }
    return (
      <pre
        className={ this.rootcn`language-json` }
      >
        <code
          /* eslint-disable react/no-danger */
          dangerouslySetInnerHTML={ { __html: Prism.highlight(
            validJSON,
            Prism.languages.json,
          ) } }
          /* esling-enable */
        />
      </pre>
    );
  }
}
