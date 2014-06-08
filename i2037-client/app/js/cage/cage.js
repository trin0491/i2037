angular.module('i2037.cage', [
  'ngRoute', 
  'i2037.services', 
  'i2037.directives.d3', 
  'i2037.fx'
])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/cage', {templateUrl: 'partials/cage.html', controller: 'CageCtrl'});
}])

.controller('FusionPanelCtrl', ['$scope', 'PricingFacade', function($scope, PricingFacade) {
  $scope.quote = {
    ccyPair: 'EURUSD',
    enteredCcy: 'EUR',
    qty: 1000000,
    state: 'locked',
    buyPx: {
      spot: { prefix: 1.32, pips: 64, decimals: 4, raw: 1.32644 },
      fwdPts: 0.30,
      allIn: { prefix: 1.32, pips: 64, decimals: 7, raw: 1.32647 }
    },
    sellPx: {
      spot: { prefix: 1.32, pips: 63, decimals: 4, raw: 1.32637 },
      fwdPts: 0.30,
      allIn: { prefix: 1.32, pips: 63, decimals: 7, raw: 1.32647 }      
    }
  };

  PricingFacade.getOrderBook({ccyPair:'EURUSD'}).then(function (ob) {
    $scope.quote.buy = ob.buy;
    $scope.quote.sell = ob.sell;
  });
}])

.controller('CageCtrl', ['$scope', 'JournalSummary', 'JournalStoryline', 'd3Service', function($scope, JournalSummary, JournalStoryline, d3Service) {
  // JournalSummary.get({from: '20140412', to: '20140413'}).then(function(days) {
  //    $scope.activities = days[1].activities;

  //    var totalDistance = 0;
  //    days[1].activities.forEach(function(activity) {
  //       totalDistance += activity.distance;
  //    });
  //    $scope.distance = totalDistance + 'm';
  // });

  var dt = new Date();

  // JournalStoryline.query({date: dt}).then(function(storylines) {
  //   $scope.days = storylines;
  // });

  var ngD3 = d3Service.d3;

}])

.controller('GraphCtrl', ['$scope', 'MovesPlaces', 'MovesStoryline',
  function ($scope, MovesPlaces, MovesStoryline) {

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
