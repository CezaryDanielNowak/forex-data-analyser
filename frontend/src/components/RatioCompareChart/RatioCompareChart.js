import React from 'react';
import PropTypes from 'prop-types';
import BaseComponent from 'components/BaseComponent';
import DateBasedLineChart from 'components/DateBasedLineChart';
import DataSourceSelector from 'components/DataSourceSelector';
import { get_data_intersection } from 'models/api';
import { median } from 'simple-statistics';
import { stringToDate } from 'sf/helpers/date';

export default class RatioCompareChart extends BaseComponent {
  className = 'ts-RatioCompareChart';

  static propTypes = {
    width: PropTypes.any,
    height: PropTypes.any,
    onDataSourceChange: PropTypes.func,
    sources: PropTypes.array.isRequired,
  };

  static defaultProps = {
    width: '100%',
    height: '500px',
    onDataSourceChange: () => {},
  };

  constructor(props) {
    super(props);

    this.state = {
      data: [],
      sources: props.sources,
    };
  }

  componentDidMount() {
    this.getDataForSources(this.state.sources);
  }

  handleDataSourceChange = (sourcesArr) => {
    const flatSources = sourcesArr.map((source) => source.value);
    this.setState({ sources: flatSources });
    this.getDataForSources(flatSources);

    this.props.onDataSourceChange(sourcesArr);
  }

  getDataForSources(sources) {
    get_data_intersection(sources)
      .then((response) => {
        const ratioArray = [];
        for (let i = 0, len = response[0].length; i < len; i++) {
          ratioArray.push(response[0][i].close / response[1][i].close);
        }

        const ratioMedian = median(ratioArray);

        console.log('1', response[0].length);
        console.log('2', response[1].length);

        const data = response[0]
          .map(({ date, time }, i) => {
            if(response[0][i].date !== response[1][i].date) {
              console.warn('!!!!!!!!!!!!!!', response[0][i].date, response[1][i].date)
            }
            return {
              'date': stringToDate(date, time),
              'value': ((ratioArray[i] - ratioMedian) / ratioMedian) * 100, // mediam becomes 0. value in %
              'priceA': response[0][i].close,
              'priceB': response[1][i].close,
            };
          });

        this.setState({ data });
      })
      .catch((err) => {
        console.log('err', err);
      });
  }

  render() {
    return (
      <div
        className={ this.rootcn() }
      >
        <h2>{ this.state.sources.join('/').replace(/\.CSV/g, '') }</h2>
        <DataSourceSelector min={ 2 } max={ 2 } onChange={ this.handleDataSourceChange } />
        <DateBasedLineChart
          valueLabel="Percentage deviation from median ratio"
          width={ this.props.width }
          height={ this.props.height }
          data={ this.state.data }
          extraAxis={ [
            { id: 'priceA', label: this.state.sources[0].replace('.CSV', '') },
            { id: 'priceB', label: this.state.sources[1].replace('.CSV', '') }
          ] }
        />
      </div>
    );
  }
}
