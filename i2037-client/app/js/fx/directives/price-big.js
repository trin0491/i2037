(function() {
  'use strict';

  var TEMPLATE = 'fx/directives/price-big.tpl.html';

  angular.module('i2037.fx.directives.priceBig', [TEMPLATE])

  .directive('i2PriceBig', function() {
    return {
      restrict: 'E',
      templateUrl: TEMPLATE,
      replace: true,
      link: function($scope, element, attrs) {
        $scope.px = {
          prefix: 1.32,
          pips: 64,
          decimals: 7
        };
      }
    };
  });
}());

