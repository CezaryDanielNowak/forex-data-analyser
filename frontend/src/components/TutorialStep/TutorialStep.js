import React from 'react';
import flatMap from 'lodash/flatMap';
import is from 'next-is';
import PropTypes from 'prop-types';

import BasePage from 'pages/BasePage';
import Img from 'sf/components/Img';
import { asset } from 'sf/helpers';
import { scrollTo } from 'sf/helpers/domHelper';

const stepShape = PropTypes.shape({
  theme: PropTypes.oneOf(['default', 'error']),
  titleMobile: PropTypes.node,
  imageMobile: PropTypes.string,
  imageMobileSizes: PropTypes.array,

  titleDesktop: PropTypes.node,
  imageDesktop: PropTypes.string,
  imageDesktopSizes: PropTypes.array,

  title: PropTypes.node,
  image: PropTypes.string,

  content: PropTypes.node,
  contentMobile: PropTypes.node,
  contentDesktop: PropTypes.node,
});

export const TARGET_BEFORE = 'before';
export const TARGET_AFTER = 'after';

export default class TutorialStep extends BasePage {
  className = 'ts-TutorialStep';

  static propTypes = {
    steps: PropTypes.arrayOf(stepShape).isRequired,
    stepsBefore: PropTypes.arrayOf(stepShape),
    stepsAfter: PropTypes.arrayOf(stepShape),
    captureTopic: PropTypes.string,
    captureTopicTarget: PropTypes.oneOf([undefined, TARGET_BEFORE, TARGET_AFTER]),
  };

  static defaultProps = {
    steps: [],
    stepsBefore: [],
    stepsAfter: [],
  }

  state = {};

  mediatorTopicHandler = (helpData, channel) => {
    if (helpData.tutorialError) {
      channel.stopPropagation();
      const propName = this.props.captureTopicTarget === TARGET_BEFORE
        ? 'stepsBefore'
        : 'stepsAfter';

      this.setState({ [propName]: [helpData, ...this.props[propName]] }, () => {
        scrollTo(0);
      });
    }
  }

  reset() {
    this.setState({ stepsBefore: null, stepsAfter: null });
  }

  componentDidMount() {
    if (this.props.captureTopic) {
      this.subscribe(
        this.props.captureTopic,
        this.mediatorTopicHandler,
        { priority: 9999 } // set priority high, so other handlers calls after
      );
    }
  }

  withLines = (steps) => {
    const arr = flatMap(
      steps,
      (step, lineIndex) => [
        step,
        <div key={ `line-${lineIndex}` } className={ this.cn`__step-line` } />,
      ],
    );
    arr.pop();
    return arr;
  }

  renderStep = (stepData) => {
    const content = (is.mobile() ? stepData.contentMobile : stepData.contentDesktop)
      || stepData.content;

    return (
      <div
        key={ stepData.image || stepData.imageDesktop || stepData.imageMobile }
        className={ this.cn`__single_step --theme-${stepData.theme || 'default'}` }
      >
        <h2 className={ this.cn`__h2 __h2--mobile` }>
          { stepData.titleMobile || stepData.title }
        </h2>
        <div className={ this.cn`__img-container` }>
          <Img
            src={ asset(stepData.imageDesktop || stepData.image) }
            responsiveSizes={ stepData.imageDesktopSizes }
            className={ this.cn`__img __img--desktop` }
          />
          <Img
            src={ asset(stepData.imageMobile || stepData.image) }
            responsiveSizes={ stepData.imageMobileSizes }
            className={ this.cn`__img __img--mobile` }
          />
        </div>
        <div className={ this.cn`__step-text` }>
          { (stepData.titleDesktop || stepData.title) &&
            <h2 className={ this.cn`__h2 __h2--desktop` }>
              { stepData.titleDesktop || stepData.title }
            </h2>
          }
          {
            content &&
            <div className={ this.cn`__p` }>
              { stepData.content }
            </div>
          }
        </div>
      </div>
    );
  }

  render() {
    return this.withLines([
      ...(this.state.stepsBefore || this.props.stepsBefore).map(this.renderStep),
      ...this.props.steps.map(this.renderStep),
      ...(this.state.stepsAfter || this.props.stepsAfter).map(this.renderStep),
    ].filter(Boolean));
  }
}
