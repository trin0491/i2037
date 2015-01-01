(function() {
  'use strict';

  var TEMPLATE = 'fx/directives/price-vwap.tpl.html';

  angular.module('i2037.fx.directives.priceVwap', [TEMPLATE])

  .directive('i2PriceVwap', function() {
    return {
      restrict: 'E',
      templateUrl: TEMPLATE,
      replace: true,
      scope: {
        px: '='
      },
      link: function($scope, element, attrs) {
      }
    };
  });
}());

