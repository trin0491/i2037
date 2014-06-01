(function() {
  'use strict';

  angular.module('i2037.fx.directives.rung', [])

  .directive('i2Rung', function() {
    return {
      restrict: 'A',
      link: function($scope, element, attrs) {
        $scope.rung = { px: 65, cumQty: 5 };
      }
    };
  });
}());

