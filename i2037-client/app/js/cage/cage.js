angular.module('i2037.cage', ['ngRoute', 'i2037.services'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/cage', {templateUrl: 'partials/slickgrid.html', controller: 'SlickgridCtrl'});
}])

.controller('SlickgridCtrl', ['$scope', 'MovesSummary', 'MovesPlaces', 'MovesStoryline',
  function ($scope, MovesSummary, MovesPlaces, MovesStoryline) {

  function drawChart(rows) {
    var chart = new Highcharts.Chart({
      chart: {
        type: 'line',
        renderTo: 'graph'
      },
      title: {
          text: 'Distance Travelled',
      },
      subtitle: {
          text: 'Source: moves-app.com',
      },
      xAxis: {
          categories: rows.map(function(row) {
            return row.date;
          }),
          // tickInterval: 5
      },
      yAxis: {
          title: {
              text: 'Distance (m)'
          },
      },
      tooltip: {
          valueSuffix: 'm'
      },
      legend: {
          layout: 'vertical',
          align: 'right',
          verticalAlign: 'middle'
      },
      series: [{
          name: 'Walk',
          data: rows.map(function(row) {
            return row.wlk ? row.wlk : 0;
          })
      }]      
    });
  }

  function drawGraph(response) {
    var columns = [
      {id: "date", name: "Date", field: "date", width:100},
      {id: "walk", name: "Walk (m)", field: "wlk", width:100},
      {id: "run", name: "Run (m)", field: "run", width:100},
      {id: "cycle", name: "Cycle (m)", field: "cyc", width:100},
    ];

    var rows = [];
    for (var i = 0; i < response.length; i++) {
      var day = response[i];
      if (day.summary) {        
        var row = {date: day.date};
        for(var n=0;n<day.summary.length;n++) {
          row[day.summary[n].activity] = day.summary[n].distance;
        }
        rows.push(row);
      }
    }
    var grid = new Slick.Grid('#myGrid', rows, columns, {
      enableCellNavigation: true,
      enableColumnReorder: false
    });

    drawChart(rows);    
  }

}]);
