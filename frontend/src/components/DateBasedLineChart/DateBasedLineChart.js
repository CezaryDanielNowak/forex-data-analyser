import React from 'react';
import PropTypes from 'prop-types';
import BaseComponent from 'components/BaseComponent';

export default class DateBasedLineChart extends BaseComponent {
  className = 'ts-DateBasedLineChart';

  static propTypes = {
    width: PropTypes.any,
    height: PropTypes.any,
    data: PropTypes.arrayOf(
      PropTypes.shape({
        date: PropTypes.string.isRequired,
        value: PropTypes.number.isRequired,
      })
    ),
    valueAxisLabel: null,
  };

  static defaultProps = {
    width: '100%',
    height: '500px',
  };

  componentDidMount() {
    this.runChart();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.data !== nextProps.data) {
      this.setTimeout(() => {
        // update am4charts just on props update
        this.runChart();
      }, 100);
    }
  }

  runChart() {
    /*
    sample data:

    [
      {
        "date": "2019-11-07T12:04:02.289Z",
        "value": -36
      },
      {
        "date": "2019-11-08T12:04:02.289Z",
        "value": -26
      },
      {
        "date": "2019-11-09T12:04:02.289Z",
        "value": -22
      },
      ...
    ]
     */
    if (!this.props.data) {
      return;
    }

    am4core.ready(() => {
      // Themes begin
      // am4core.useTheme(am4themes_animated);
      // Themes end

      // Create chart instance
      const chart = am4core.create(`${this.className}_${this.componentId}`, am4charts.XYChart);

      // Add data
      chart.data = this.props.data;

      // Create axes
      const dateAxis = chart.xAxes.push(new am4charts.DateAxis());
      // dateAxis.startLocation = 0.5;
      // dateAxis.endLocation = 0.5;

      dateAxis.baseInterval = {
        timeUnit: 'minute',
        count: 1
      };

/*
dateAxis.groupIntervals.setAll([
  { timeUnit: "month", count: 1 },
  { timeUnit: "year", count: 1 },
  { timeUnit: "year", count: 10 }
]);

// https://www.amcharts.com/docs/v4/concepts/performance/

am4core.options.minPolylineStep = 5;
processTimeout = 1 // TODO
sequencedAnimation = false // TODO
zoomOutOnDataUpdate = false // TODO?
accessible = false

am4core.options.queue = true; // init charts one-by-one
am4core.options.onlyShowOnViewport = true;

 */

      // https://www.amcharts.com/docs/v4/concepts/axes/date-axis/#Dynamic_data_item_grouping
      dateAxis.groupData = true;
      dateAxis.groupCount = 2000; // maximum number of data items we allow to be displayed at a time

      // Create value axis
      const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.title.text = this.props.valueAxisLabel;
      valueAxis.title.fontWeight = 'bold';

      // Create series
      const series = chart.series.push(new am4charts.LineSeries());
      series.dataFields.valueY = 'value';
      series.dataFields.dateX = 'date';
      series.strokeWidth = 3;
      series.tooltipText = '{valueY.value}';
      series.fillOpacity = 0.1;

      // Create a range to change stroke for values below 0
      const range = valueAxis.createSeriesRange(series);
      range.value = 0;
      // range.endValue = -1000;
      range.endValue = -chart.data.length;
      range.contents.stroke = chart.colors.getIndex(4);
      range.contents.fill = range.contents.stroke;
      range.contents.strokeOpacity = 0.7;
      range.contents.fillOpacity = 0.1;

      // Add cursor
      chart.cursor = new am4charts.XYCursor();
      chart.cursor.xAxis = dateAxis;
      chart.scrollbarX = new am4core.Scrollbar();

      series.tooltip.getFillFromObject = false;
      series.tooltipText = "{dateX.formatDate('yyyy-MM-dd HH:mm:ss')}";



      series.tooltip.adapter.add('x', (x, target) => {
        if (series.tooltip.tooltipDataItem.valueY < 0) {
          series.tooltip.background.fill = chart.colors.getIndex(4);
        } else {
          series.tooltip.background.fill = chart.colors.getIndex(0);
        }
        return x;
      });
    });
  }


  render() {
    return (
      <div
        { ...this.props }
        className={ this.rootcn() }
      >
        <div
          id={ `${this.className}_${this.componentId}` }
          style={ {
            width: this.props.width,
            height: this.props.height,
          } }
        ></div>
      </div>
    );
  }
}
