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
          .style('height', '100%');

        var pie = d3.layout.pie().sort(null);
        var arc = d3.svg.arc().innerRadius(0);
        var g, radius;

        function update(data, radius) {
          if (!data) {
            return;
          }

          function arcTween(d, index, attr) {
            var i = d3.interpolate(0, radius);
            return function(t) {
              return arc({
                startAngle: d.startAngle, 
                endAngle: d.endAngle,
                innerRadius: 0,
                outerRadius: i(t)
              });
            };
          }

          var paths = g.selectAll("path")
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

        function render(data) {
          svg.selectAll("*").remove();

          var width = element.width();
          var height = element.height();
          radius = Math.min(width/2, height/2);
          g = svg.append("g")
                .attr("transform", "translate("+ width/2 +","+  height/2 + ")");

          update(data, radius);
        }

        $scope.$watch("data", function(newData, oldData) {
          update(newData, radius);
        }, true);

        $scope.$watch(function() {
          return angular.element($window)[0].innerWidth;
        }, function() {
          render($scope.data);
        });

        function onResize() {
          $scope.$apply();
        }

        angular.element($window).on('resize', onResize);

        $scope.$on('$destroy', function() {
          angular.element($window).off('resize', onResize);
        });

        render();
      }
    };
  }]);
}());

