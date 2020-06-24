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
    valueLabel: null,
    extraAxis: PropTypes.array,
    legend: PropTypes.bool,
    scrollbarX: PropTypes.bool,
  };

  static defaultProps = {
    width: '100%',
    height: '500px',
    legend: true,
    extraAxis: [
      // { id: 'priceA', label: 'GER30Cash' },
      // { id: 'priceB', label: 'POL20Cash' }
    ],
    scrollbarX: true,
  };

  componentWillUnmount() {
    if (this.chart) {
      this.chart.dispose();
    }

    super.componentWillUnmount();
  }

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
      am4core.options.minPolylineStep = 1;
      am4core.options.queue = true; // init charts one-by-one

      // Create chart instance
      const chart = am4core.create(`${this.className}_${this.componentId}`, am4charts.XYChart);
      this.chart = chart;

      // Add data
      chart.data = this.props.data;

      // Create axes
      const dateAxis = chart.xAxes.push(new am4charts.DateAxis());

      dateAxis.baseInterval = {
        timeUnit: 'minute',
        count: 1
      };

      // https://www.amcharts.com/docs/v4/concepts/axes/date-axis/#Dynamic_data_item_grouping
      dateAxis.groupData = true;
      dateAxis.groupCount = 2000; // maximum number of data items we allow to be displayed at a time

      this.createValueAxisAndSeries(chart);

      this.props.extraAxis.forEach(({ id, label }) => {
        createAxisAndSeries(chart, id, label, true);
      });

      // Add cursor
      chart.cursor = new am4charts.XYCursor();
      chart.cursor.xAxis = dateAxis;

      if (this.props.legend) {
        chart.legend = new am4charts.Legend();
      }
      if (this.props.scrollbarX) {
        chart.scrollbarX = new am4core.Scrollbar();
      }
    });
  }

  createValueAxisAndSeries(chart) {
    // Create value axis
    const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());


    // Create series
    const series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.valueY = 'value';
    series.dataFields.dateX = 'date';
    series.strokeWidth = 3;
    series.fillOpacity = 0.2;
    series.tooltip.getFillFromObject = false;
    series.tooltipText = "{dateX.formatDate('yyyy-MM-dd HH:mm:ss')}: [bold]{valueY.value}[/]";
    series.tensionX = 1;
    series.tensionY = 1;
    series.name = this.props.valueLabel;

    series.tooltip.adapter.add('x', (x, target) => {
      if (series.tooltip.tooltipDataItem.valueY < 0) {
        series.tooltip.background.fill = chart.colors.getIndex(4);
      } else {
        series.tooltip.background.fill = chart.colors.getIndex(0);
      }
      return x;
    });

    // Create a range to change stroke for values below 0
    const range = valueAxis.createSeriesRange(series);
    range.value = 0;
    range.endValue = -chart.data.length;
    range.contents.stroke = chart.colors.getIndex(4);
    range.contents.fill = range.contents.stroke;
    range.contents.strokeOpacity = 0.7;
    range.contents.fillOpacity = 0.1;
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

function createAxisAndSeries(chart, field, name, opposite) {
  const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
  valueAxis.cloneTooltip = false;
  valueAxis.extraMax = 0.25;
  valueAxis.extraMin = 0.25;

  const series = chart.series.push(new am4charts.LineSeries());
  series.dataFields.valueY = field;
  series.dataFields.dateX = 'date';
  series.strokeWidth = 2;
  series.yAxis = valueAxis;
  series.name = name;
  series.tooltipText = '{name}: [bold]{valueY}[/]';
  series.tensionX = 1;
  series.tensionY = 1;

  valueAxis.renderer.line.strokeOpacity = 1;
  valueAxis.renderer.line.strokeWidth = 2;
  valueAxis.renderer.line.stroke = series.stroke;
  valueAxis.renderer.labels.template.fill = series.stroke;
  valueAxis.renderer.opposite = opposite;
  valueAxis.renderer.grid.template.disabled = true;
}
