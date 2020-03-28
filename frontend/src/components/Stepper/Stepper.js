import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'sf/components/Icon';
import BaseComponent from 'components/BaseComponent';

export default class Stepper extends BaseComponent {
  className = 'ts-Stepper';

  static propTypes = {
    steps: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string,
        completed: PropTypes.bool,
        active: PropTypes.bool,
      })
    ),
  };

  static defaultProps = {
    steps: [],
  };

  renderSteps = () => {
    const steps = this.props.steps.map((step) => {
      const stepClassnames = {
        '__step': true,
        '__step--active': step.active,
        '__step--completed': step.completed
      };
      return (
        <li
          className={ this.cn(stepClassnames) }
          key={ step.label }
        >
          <div className={ this.cn`__step-label` }>
            { step.label }
          </div>
          <div className={ this.cn`__check-container` }>
            { step.completed &&
              <Icon
                set="fa"
                key="check"
                type="check"
              />
            }
          </div>
        </li>
      );
    });
    return <ul className={ this.cn`__steps` }>{ steps }</ul>;
  }

  render() {
    return (
      <div className={ this.rootcn`` }>
        { this.renderSteps() }
      </div>
    );
  }
}
