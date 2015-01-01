
angular.module('i2037.directives.timeline', ['common/directives/timeline.tpl.html', 'i2037.filters'])

.directive('i2Timeline', ['$compile', function($compile) {
  return {
    // transclude: true,
    replace: true,
    scope: {
      selected: '=i2Selected',
      timeline: '=i2Timeline',
    },
    templateUrl: 'common/directives/timeline.tpl.html',

    compile: function(element, attrs, linker) {

      return function postLink($scope, element, attrs) {

        $scope.isSelected = function(entry) {
          return entry === $scope.selected;
        };

        $scope.toggleSelect = function(entry) {
          if ($scope.isSelected(entry)) {
            $scope.selected = undefined;
          } else {
            $scope.selected = entry;
          }
        };

        $scope.isNewDay = function(index) {
          if (index < 1) {
            return true;
          }
          var curr = $scope.timeline[index].date;
          var prev = $scope.timeline[index-1].date;

          if (curr.getDate() !== prev.getDate()) {
            return true;
          } else {
            return false;
          }
        };
      };
    }
  };
}])
;