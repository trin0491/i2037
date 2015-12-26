///<reference path="../../../../typings/tsd.d.ts" />
  var TEMPLATE = 'fx/directives/price-vwap.tpl.html';

export default angular.module('i2037.fx.directives.priceVwap', [TEMPLATE])

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

