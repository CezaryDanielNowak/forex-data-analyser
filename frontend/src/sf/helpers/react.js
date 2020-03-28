import React from 'react';
import { findDOMNode, hydrate } from 'react-dom';
import PropTypes from 'prop-types';
import template from 'lodash/template';
import mapValues from 'lodash/mapValues';

export const isValidElement = (value) => {
  return React.isValidElement(value) || Array.isArray(value);
};

/**
 * renderTemplate is the same as lodash/template but returns react element
 * instead of string (if needed). Additionally parameters passed to renderTemplate
 * also can be React Element.
 *
 * NOTE: All HTML tags are changed into html!
 * This is potential security problem, and you should never pass unsafe
 * strings here.
 *
 * @param  {String} templateString
 * @return {ReactElement}
 */
class ReactTemplateResult extends React.PureComponent {
  static propTypes = {
    reactElementParams: PropTypes.object,
    templateResult: PropTypes.string,
  };

  componentDidMount() {
    const reactElementParamsArr = Object.entries(this.props.reactElementParams);
    if (reactElementParamsArr.length) {
      const root = findDOMNode(this);
      reactElementParamsArr.forEach(([param, value]) => {
        hydrate(value, root.querySelector(`[template-id="${param}"]`));
      });
    }
  }

  render() {
    // eslint-disable-next-line react/no-danger
    return <span dangerouslySetInnerHTML={ { __html: this.props.templateResult } } />;
  }
}

export const renderTemplate = (templateString) => {
  const lodashTemplate = template(templateString);

  return (params = {}) => {
    const reactElementParams = {};
    const paramsPlaceholders = mapValues(params, (value, param) => {
      if (isValidElement(value)) {
        reactElementParams[param] = value;
        return `<span template-id="${param}"></span>`;
      }
      return value;
    });

    const templateResult = lodashTemplate(paramsPlaceholders);

    return (
      <ReactTemplateResult
        key={ `${templateString}${Math.random()}` }
        templateResult={ templateResult }
        reactElementParams={ reactElementParams }
      />
    );
  };
};

export const isReactComponent = (component) => {
  return !!(
    typeof component === 'function'
    && (
      // functional component. Might not be 100% accurate
      /return(.*)\.createElement\(/.test(component.toString())
      || component.prototype.isReactComponent // class Component
    )
  );
};

export const joinArray = (array, joinWith = ', ') => {
  if (!array || array.length < 2) return array;

  return array.reduce((prev, curr) => [prev, joinWith, curr]);
};

