import React from 'react';
import omit from 'lodash/omit';
import PropTypes from 'prop-types';
import BaseComponent from 'components/BaseComponent';
import { generateToken, symbols } from 'sf/helpers';

const ID_LENGTH = 8;

export const POSITIONS = symbols('TOP', 'BOTTOM', 'LEFT', 'RIGHT');

export default function withLabel(ComposedComponent) {
  return class Label extends BaseComponent {
    className = 'ts-Label';

    id = generateToken(ID_LENGTH);

    static propTypes = {
      labelClassName: PropTypes.string,
      labelPosition: PropTypes.oneOf(Object.values(POSITIONS)),
      labelText: PropTypes.string,
    };

    static defaultProps = {
      labelClassName: null,
      labelPosition: POSITIONS.TOP,
      labelText: null,
    };

    setValid = (...args) => this.refs.component.setValid(...args);

    render() {
      const { labelClassName, labelPosition, labelText } = this.props;
      const classNames = {
        '--column': labelPosition === POSITIONS.BOTTOM,
        '--reversed': labelPosition === POSITIONS.LEFT,
        '--column-reversed': labelPosition === POSITIONS.TOP,
      };
      return (
        <div className={ this.rootcn(classNames) }>
          <ComposedComponent
            { ...omit(this.props, ['labelText']) }
            id={ this.id }
            ref="component"
          />
          { labelText &&
            <label
              className={ this.cn({
                '__label': true,
                ...classNames,
                [labelClassName]: !!labelClassName,
              }) }
              htmlFor={ this.id }
            >
              { labelText }
            </label>
          }
        </div>
      );
    }
  };
}
