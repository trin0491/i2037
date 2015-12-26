///<reference path="../../../../typings/tsd.d.ts" />

import services from "../../common/services/services";

export default angular.module('i2037.fx.directives.depthChart', [services.name])

  .directive('i2DepthChart', ['d3Service', '$window', function (d3Service, $window) {
    return {
      restrict: 'A',
      replace: false,
      scope: {
        data: '=',
        max: '=',
        colours: '='
      },
      link: function ($scope, element, attrs) {

        var d3 = d3Service.d3();
        var colour = d3.scale.ordinal().range(['#C3E9FF', '#3599F3', '#042E67', '#1F5C99']);
        var svg = d3.select(element[0])
          .append('svg')
          .attr('viewBox', '0 0 10 10')
          .attr('class', 'x-depth-chart');
        var GAP = 2;


        function render(data, max) {
          if (!data) {
            return;
          }
          var width = element.width();
          var height = element.height();
          var x = d3.scale.linear()
            .domain([0, max])
            .range([0, width - (data.length - 1) * GAP]);

          svg.attr('viewBox', '0 0 ' + width + ' ' + height);

          var bars = svg.selectAll("g")
            .data(data);

          // update

          // enter
          bars.enter()
            .append("g")
            .append("rect");

          // enter + update
          bars.attr("transform", function (d, i) {
              var sum = d3.sum(data.slice(0, i));
              var offset = i * GAP + x(sum);
              if (attrs.align === 'right') {
                offset = width - (offset + x(d));
              }
              return "translate(" + offset + ",0)";
            })
            .select("rect")
            .attr("width", function (d) {
              return x(d);
            })
            .attr("height", height)
            .style("fill", function (d, i) {
              return colour(i);
            });

          // exit
          bars.exit().remove();
        }

        $scope.$watch("data", function (newData, oldData) {
          render(newData, $scope.max);
        }, true);

        $scope.$watch("max", function (newMax) {
          render($scope.data, newMax);
        }, true);

        $scope.$watch(function () {
          return angular.element($window).innerWidth();
        }, function () {
          render($scope.data, $scope.max);
        });

        function onResize() {
          $scope.$apply();
        }

        angular.element($window).on('resize', onResize);

        $scope.$on('$destroy', function () {
          angular.element($window).off('resize', onResize);
        });
      }
    };
  }]);


