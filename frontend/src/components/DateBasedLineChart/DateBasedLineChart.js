import React from 'react';
import PropTypes from 'prop-types';
import BaseComponent from 'components/BaseComponent';
import { getScript } from 'sf/helpers/domHelper';

export default class DateBasedLineChart extends BaseComponent {
  className = 'ts-DateBasedLineChart';

  static propTypes = {
    width: PropTypes.any,
    height: PropTypes.any,
  };

  static defaultProps = {
    width: '100%',
    height: '500px'
  };

  componentDidMount() {
    this.runChart();
  }

  runChart() {
    am4core.ready(function() {

      // Themes begin
      // am4core.useTheme(am4themes_animated);
      // Themes end

      // Create chart instance
      var chart = am4core.create("chartdiv", am4charts.XYChart);

      // Add data
      chart.data = generatechartData();
      function generatechartData() {
        var chartData = [];
        var firstDate = new Date();
        firstDate.setDate( firstDate.getDate() - 150 );
        var visits = -40;
        var b = 0.6;
        for ( var i = 0; i < 150; i++ ) {
          // we create date objects here. In your data, you can have date strings
          // and then set format of your dates using chart.dataDateFormat property,
          // however when possible, use date objects, as this will speed up chart rendering.
          var newDate = new Date( firstDate );
          newDate.setDate( newDate.getDate() + i );
          if(i > 80){
              b = 0.4;
          }
          visits += Math.round((Math.random()<b?1:-1)*Math.random()*10);

          chartData.push( {
            date: newDate,
            visits: visits
          } );
        }
        return chartData;
      }

      // Create axes
      var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
      dateAxis.startLocation = 0.5;
      dateAxis.endLocation = 0.5;

      // Create value axis
      var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

      // Create series
      var series = chart.series.push(new am4charts.LineSeries());
      series.dataFields.valueY = "visits";
      series.dataFields.dateX = "date";
      series.strokeWidth = 3;
      series.tooltipText = "{valueY.value}";
      series.fillOpacity = 0.1;

      // Create a range to change stroke for values below 0
      var range = valueAxis.createSeriesRange(series);
      range.value = 0;
      range.endValue = -1000;
      range.contents.stroke = chart.colors.getIndex(4);
      range.contents.fill = range.contents.stroke;
      range.contents.strokeOpacity = 0.7;
      range.contents.fillOpacity = 0.1;

      // Add cursor
      chart.cursor = new am4charts.XYCursor();
      chart.cursor.xAxis = dateAxis;
      chart.scrollbarX = new am4core.Scrollbar();

      series.tooltip.getFillFromObject = false;
      series.tooltip.adapter.add("x", (x, target)=>{
          if(series.tooltip.tooltipDataItem.valueY < 0){
              series.tooltip.background.fill = chart.colors.getIndex(4);
          }
          else{
              series.tooltip.background.fill = chart.colors.getIndex(0);
          }
          return x;
      })

    }); // end am4core.ready()
  }


  render() {
    return (
      <div
        { ...this.props }
        className={ this.rootcn() }
      >
        <div
          id="chartdiv"
          style={ {
            width: this.props.width,
            height: this.props.height,
          } }
        ></div>
      </div>
    );
  }
}
