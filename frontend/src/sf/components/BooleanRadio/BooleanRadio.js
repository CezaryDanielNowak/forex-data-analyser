import React from 'react';
import PropTypes from 'prop-types';
import BaseComponent from 'components/BaseComponent';
import Radio from 'sf/components/Radio';

export default class BooleanRadio extends BaseComponent {
  className = 'ts-BooleanRadio';

  static propTypes = {
    initialValue: PropTypes.bool,
    labels: PropTypes.shape({
      negative: PropTypes.string,
      positive: PropTypes.string,
    }),
    stateLink: PropTypes.array.isRequired,
  };

  static defaultProps = {
    initialValue: null,
    labels: {
      negative: 'No',
      positive: 'Yes',
    },
  };

  state = {
    value: this.props.initialValue,
  };

  handleChange = () => {
    const [context, prop] = this.props.stateLink;
    context.setState({
      [prop]: this.state.value,
    }, () => this.setValid(true));
  };

  setValid = (status) => {
    Object.keys(this.refs).forEach((key) => {
      if (this.refs[key].setValid) {
        this.refs[key].setValid(status);
      }
    });
  };

  render() {
    return (
      <div
        className={ this.rootcn() }
      >
        <div className={ this.cn`__answers` }>
          <Radio
            className={ this.cn`__radio` }
            ref="positive"
            stateLink={ [this, 'value'] }
            radioStyle="radio"
            value={ true }
            onChange={ this.handleChange }
          >
            { this.props.labels.positive }
          </Radio>

        </div>
        <div className={ this.cn`__answers` }>
          <Radio
            className={ this.cn`__radio` }
            ref="negative"
            stateLink={ [this, 'value'] }
            radioStyle="radio"
            value={ false }
            onChange={ this.handleChange }
          >
            { this.props.labels.negative }
          </Radio>
        </div>
      </div>
    );
  }
}
