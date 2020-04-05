import React from 'react';
import PropTypes from 'prop-types';
import BaseComponent from 'components/BaseComponent';
import MultipleInput from 'sf/components/MultipleInput';
import api from 'models/api';

export default class DataSourceSelector extends BaseComponent {
  className = 'ts-DataSourceSelector';

  static propTypes = {
    min: PropTypes.number,
    max: PropTypes.number,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    min: 1,
    max: 1,
    onChange: () => {},
  };

  state = {
    dataSources: [],
    selectedValues: []
  };

  componentDidMount() {
    this.getDataFromApi();
  }

  getDataFromApi() {
    api.get_available_sources()
      .then((dataSources) => {
        this.setState({ dataSources });
      })
      .catch((err) => {
        alert('Unhandled error. Handle me please');
        console.log('err', err);
      });
  }

  render() {
    const { max, min } = this.props;

    let displayNameAddon = '';
    if (min && max) {
      if (min === max) {
        displayNameAddon = `(select ${min})`;
      } else {
        displayNameAddon = `(${min} to ${max})`;
      }
    }
    if (min && !max) {
      displayNameAddon = `(minimum ${min})`;
    }

    const displayName = `Select source data ${displayNameAddon}`;
    return (
      <div
        className={ this.rootcn() }
      >
        <MultipleInput
          displayName={ displayName }
          max={ this.props.max }
          options={ this.state.dataSources.map((dataSource) => {
            return {
              value: dataSource,
              label: dataSource.replace('.CSV', ''),
            };
          }) }
          stateLink={ [this, 'selectedValues'] }
          onChange={ (values) => {
            if (values.length >= min && values.length <= max) {
              this.props.onChange(values);
            }
          } }
        />
      </div>
    );
  }
}
