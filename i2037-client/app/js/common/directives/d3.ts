///<reference path="../../../../typings/tsd.d.ts" />
///<reference path="../services/services.ts" />

module i2037.directives {

  import D3Service = i2037.services.D3Service;

  angular.module('i2037.directives.d3', ['i2037.services'])

  .directive('i2Pie', ['d3Service', '$window', function(d3Service:D3Service, $window) {
    return {
      replace: false,
      scope: {
        data: '=',
        max: '=',
        title: '=',
        colours: '='
      },
      link: function($scope, element, attrs) {

        var d3:D3.Base = d3Service.d3();
        var colour = d3.scale.ordinal().range($scope.colours);
        var svg = d3.select(element[0]).append('svg')
          .style('width', '100%')
          .style('height', '100%')
          .append("g");

        var pie = d3.layout.pie()
          .sort(null)
          .value(function(d) { return d[attrs.valueField]; });

        function updateSlices(data, arc, radius, innerRadiusRatio) {
          function arcTween(d, index, attr) {
            var arc = d3.svg.arc()
              .outerRadius(function(r) { return r;})
              .innerRadius(function(r) { return r * innerRadiusRatio;})
              .startAngle(d.startAngle)
              .endAngle(d.endAngle);        
            var i = d3.interpolate(0, radius);
            return function(t) {
              var r = i(t);
              return arc(r);
            };
          }

          var paths = svg.selectAll("path")
            .data(pie(data));

          // update
          paths.attr("d", arc);

          // enter and update
          paths.enter()          
            .append("path")
            .style("fill", function(d, i) { return colour(i); })
            .transition()
            .duration(800)
            .attrTween("d", arcTween);

          // exit
          paths.exit()
            .remove();
        }

        function updateLabels(data, arc) {
          var labels = svg.selectAll(".i2-label")
            .data(pie(data));

          labels.enter()
            .append("text")
            .attr("class", "i2-label")
            .attr("dy", ".35em")
            .style("text-anchor", "middle");

          labels.attr("transform", function(d) { return "translate("+arc.centroid(d)+")"; })
            .text(function(d) { return d.data[attrs.labelField]; });

          labels.exit()
            .remove();                      
        }

        function update(data, radius, innerRadiusRatio) {
          var arc = d3.svg.arc()
            .innerRadius(radius * innerRadiusRatio)
            .outerRadius(radius);

          updateSlices(data, arc, radius, innerRadiusRatio);

          if (attrs.labelField) {
            updateLabels(data, arc);
          }
        }

        function render(data, max) {
          if (!data) {
            return;
          }

          var width = element.width();
          var height = element.height();
          svg.attr("transform", "translate("+ width/2 +","+ height/2 + ")");

          var maxRadius = Math.min(width/2, height/2);
          var radius = maxRadius;
          if (max > 0) {
            radius = Math.min(
              d3.sum(data.map(function(d) { return d[attrs.valueField];})) / max * maxRadius, 
              maxRadius
            );
          } 

          var innerRadiusRatio = attrs.innerRadiusRatio || 0;
          update(data, radius, innerRadiusRatio);
        }

        $scope.$watch("title", function(value) {
          var title = svg.selectAll(".i2-title").data([value]);
          
          title.enter()
            .append("text")
            .attr("class", "i2-title")
            .attr("dy", ".35em")
            .style("text-anchor", "middle");

          title.text(value);

          title.exit().remove();
        }, true);

        $scope.$watch("data", function(newData, oldData) {
          render(newData, $scope.max);
        }, true);

        $scope.$watch("max", function(newMax) {
          render($scope.data, newMax);
        }, true);

        $scope.$watch(function() {
          return angular.element($window)[0].innerWidth;
        }, function() {
          render($scope.data, $scope.max);
        });

        function onResize() {
          $scope.$apply();
        }

        angular.element($window).on('resize', onResize);

        $scope.$on('$destroy', function() {
          angular.element($window).off('resize', onResize);
        });
      }
    };
  }]);
}
