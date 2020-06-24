import React from 'react';
import PropTypes from 'prop-types';
import BaseComponent from 'components/BaseComponent';
import DateBasedLineChart from 'components/DateBasedLineChart';
import DataSourceSelector from 'components/DataSourceSelector';
import { get_day_by_day_data } from 'models/api';
import { median } from 'simple-statistics';
import { stringToDate } from 'sf/helpers/date';

const DAY_NAMES = [
  'Sun',
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat',
];

export default class DayByDayChart extends BaseComponent {
  className = 'ts-DayByDayChart';

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
      source: props.source,
    };
  }

  componentDidMount() {
    this.getDataForSource(this.state.source);
  }

  handleDataSourceChange = (sourcesArr) => {
    const source = sourcesArr[0].value;
    this.setState({ source });
    this.getDataForSource(source);

    this.props.onDataSourceChange(sourcesArr);
  }

  getDataForSource(source) {
    get_day_by_day_data(source)
      .then((response) => {


        const data = response.map((daysArray) => {
          return daysArray.map((day) => {
            return day.map(({ date, time, close }) => {
              return {
                'date': stringToDate(date, time),
                'value': close,
                // 'priceA': response[0][i].close,
                // 'priceB': response[1][i].close,
              };
            });
          })
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
        <h2>{ this.state.source.replace(/\.CSV/g, '') }</h2>
        <DataSourceSelector min={ 1 } max={ 1 } onChange={ this.handleDataSourceChange } />

        <div className={ this.cn`__grid` }>
          { this.state.data.map((days, i) => {
            if (days.length) {
              return <div>{ DAY_NAMES[i] }</div>;
            }

            return null;
          }) }
        </div>

        <div className={ this.cn`__grid` }>
          { this.state.data.map((days, i) => {
            if (days.length) {
              return (
                <div>
                  {
                    days.map((day, j) => {
                      return (
                        <DateBasedLineChart
                          key={ `${this.state.source}-chart-${i}-${j}` }
                          valueLabel="Price"
                          data={ day }
                          scrollbarX={ false }
                          legend={ false }
                        />
                      );
                    })
                  }
                </div>
              )
            }
          }) }
        </div>






      </div>
    );
  }
}

