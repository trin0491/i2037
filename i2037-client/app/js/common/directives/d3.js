(function() {

  angular.module('i2037.directives.d3', ['i2037.services'])

  .directive('i2Pie', ['d3Service', '$window', function(d3Service, $window) {
    return {
      replace: false,
      scope: {
        data: '=',
        max: '='
      },
      link: function($scope, element, attrs) {

        var d3 = d3Service.d3();
        var colour = d3.scale.ordinal().range(['#99EB99', '#66E066', '#33D633', '#00CC00']);
        var svg = d3.select(element[0]).append('svg')
          .style('width', '100%')
          .style('height', '100%')
          .append("g");

        var pie = d3.layout.pie().sort(null);

        function update(data, radius) {

          function arcTween(d, index, attr) {
            var arc = d3.svg.arc()
              .outerRadius(function(r) { return r;})
              .innerRadius(0)
              .startAngle(d.startAngle)
              .endAngle(d.endAngle);        
            var i = d3.interpolate(0, radius);
            return function(t) {
              var r = i(t);
              return arc(r);
            };
          }

          var arc = d3.svg.arc()
            .innerRadius(0)
            .outerRadius(radius);

          var paths = svg.selectAll("path")
            .data(pie(data))
            .attr("d", arc);

          paths.enter()          
            .append("path")
            .style("fill", function(d, i) { return colour(i); })
            .transition()
            .attrTween("d", arcTween);

          paths.exit()
            .remove();                      
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
            radius = Math.min(d3.sum(data) / max * maxRadius, maxRadius);
          } 
          update(data, radius);
        }

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
}());

