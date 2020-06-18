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
    extraAxis: PropTypes.array,
  };

  static defaultProps = {
    width: '100%',
    height: '500px',
    extraAxis: [
      // { id: 'priceA', label: 'GER30Cash' },
      // { id: 'priceB', label: 'POL20Cash' }
    ]
  };

  componentWillUnmount() {
    if (this.chart) {
      this.chart.dispose();
    };

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
      // Themes begin
      // am4core.useTheme(am4themes_animated);
      // Themes end



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
// createAxisAndSeries("views", "Views", true, "triangle");
// createAxisAndSeries("hits", "Hits", true, "rectangle");

       });

      // Add cursor
      chart.cursor = new am4charts.XYCursor();
      chart.cursor.xAxis = dateAxis;
      chart.scrollbarX = new am4core.Scrollbar();





    });
  }


  createValueAxisAndSeries(chart) {
    // Create value axis
    const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = this.props.valueAxisLabel;
    valueAxis.title.fontWeight = 'bold';
    valueAxis.cloneTooltip = false;

    // Create series
    const series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.valueY = 'value';
    series.dataFields.dateX = 'date';
    series.strokeWidth = 3;
    series.tooltipText = '{valueY.value}';
    series.fillOpacity = 0.1;
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



// Create series
function createAxisAndSeries(chart, field, name, opposite, bullet) {
  var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
  valueAxis.cloneTooltip = false;
  valueAxis.extraMax = 0.25;
  valueAxis.extraMin = 0.25;

  var series = chart.series.push(new am4charts.LineSeries());
  series.dataFields.valueY = field;
  series.dataFields.dateX = "date";
  series.strokeWidth = 2;
  series.yAxis = valueAxis;
  series.name = name;
  series.tooltipText = "{name}: [bold]{valueY}[/]";
  series.tensionX = 0.8;

  var interfaceColors = new am4core.InterfaceColorSet();

  // switch(bullet) {
  //   case "triangle":
  //     var bullet = series.bullets.push(new am4charts.Bullet());
  //     bullet.width = 12;
  //     bullet.height = 12;
  //     bullet.horizontalCenter = "middle";
  //     bullet.verticalCenter = "middle";

  //     var triangle = bullet.createChild(am4core.Triangle);
  //     triangle.stroke = interfaceColors.getFor("background");
  //     triangle.strokeWidth = 2;
  //     triangle.direction = "top";
  //     triangle.width = 12;
  //     triangle.height = 12;
  //     break;
  //   case "rectangle":
  //     var bullet = series.bullets.push(new am4charts.Bullet());
  //     bullet.width = 10;
  //     bullet.height = 10;
  //     bullet.horizontalCenter = "middle";
  //     bullet.verticalCenter = "middle";

  //     var rectangle = bullet.createChild(am4core.Rectangle);
  //     rectangle.stroke = interfaceColors.getFor("background");
  //     rectangle.strokeWidth = 2;
  //     rectangle.width = 10;
  //     rectangle.height = 10;
  //     break;
  //   default:
  //     var bullet = series.bullets.push(new am4charts.CircleBullet());
  //     bullet.circle.stroke = interfaceColors.getFor("background");
  //     bullet.circle.strokeWidth = 2;
  //     break;
  // }

  valueAxis.renderer.line.strokeOpacity = 1;
  valueAxis.renderer.line.strokeWidth = 2;
  valueAxis.renderer.line.stroke = series.stroke;
  valueAxis.renderer.labels.template.fill = series.stroke;
  valueAxis.renderer.opposite = opposite;
  valueAxis.renderer.grid.template.disabled = true;
}
