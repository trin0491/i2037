(function() {
  'use strict';

  var TEMPLATE = 'fx/directives/rung.tpl.html';

  angular.module('i2037.fx.directives.rung', [TEMPLATE])

  .directive('i2Rung', function() {
    return {
      restrict: 'A',
      link: function($scope, element, attrs) {
        $scope.rung = { px: 65, cumQty: 5 };
      }
    };
  });
}());

