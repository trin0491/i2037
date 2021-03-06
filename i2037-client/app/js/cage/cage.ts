///<reference path="../../../typings/tsd.d.ts" />

import services from "../common/services/services";
import d3 from "../common/directives/d3";
import fx from "../fx/fx";

declare var Highcharts:any;
declare var Slick:any;

export default angular.module('i2037.cage', [
    'ngRoute',
    services.name,
    d3.name,
    fx.name
  ])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/cage', {templateUrl: 'partials/cage.html', controller: 'CageCtrl'});
  }])

  .controller('FusionPanelCtrl', ['$scope', 'PricingFacade', function ($scope, PricingFacade) {
    $scope.quote = {
      ccyPair: 'EURUSD',
      enteredCcy: 'EUR',
      qty: 1000000,
      state: 'locked',
      buyPx: {
        fwdPts: 0.30,
        allIn: {prefix: 1.32, pips: 64, decimals: 7, raw: 1.32647}
      },
      sellPx: {
        fwdPts: 0.30,
        allIn: {prefix: 1.32, pips: 63, decimals: 7, raw: 1.32647}
      }
    };

    var config = {ccyPair: 'EURUSD'};
    var BUY = 1;

    $scope.quote.buyVwap = PricingFacade.getVwap(config, BUY, 10);
    $scope.quote.buy = PricingFacade.getOrderBook(config, BUY);
    $scope.quote.buyNormAmtVwap = PricingFacade.getVwap(config, BUY, 10);

    var SELL = 2;
    $scope.quote.sellVwap = PricingFacade.getVwap(config, SELL, 10);
    $scope.quote.sell = PricingFacade.getOrderBook(config, SELL);
    $scope.quote.sellNormAmtVwap = PricingFacade.getVwap(config, SELL, 10);
  }])

  .controller('CageCtrl', ['$scope', 'JournalSummary', 'JournalStoryline', 'd3Service', function ($scope, JournalSummary, JournalStoryline, d3Service) {

    var dt = new Date();

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
            categories: rows.map(function (row) {
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
            data: rows.map(function (row) {
              return row.wlk ? row.wlk : 0;
            })
          }]
        });
      }

      function drawGraph(response) {
        var columns = [
          {id: "date", name: "Date", field: "date", width: 100},
          {id: "walk", name: "Walk (m)", field: "wlk", width: 100},
          {id: "run", name: "Run (m)", field: "run", width: 100},
          {id: "cycle", name: "Cycle (m)", field: "cyc", width: 100},
        ];

        var rows = [];
        for (var i = 0; i < response.length; i++) {
          var day = response[i];
          if (day.summary) {
            var row = {date: day.date};
            for (var n = 0; n < day.summary.length; n++) {
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

