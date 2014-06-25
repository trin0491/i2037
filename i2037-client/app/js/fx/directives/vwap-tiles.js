(function() {
  'use strict';
  var TEMPLATE = 'fx/directives/vwap-tiles.tpl.html';

  angular.module('i2037.fx.directives.vwapTiles', [TEMPLATE,
    'i2037.fx.directives.priceVwap',  
    'i2037.fx.directives.tile'
  ])

  .directive('i2VwapTiles', function() {
    return {
      restrict: 'E',
      templateUrl: TEMPLATE,
      replace: true,
      link: function($scope, element, attrs) {
      }
    };
  });
}());

