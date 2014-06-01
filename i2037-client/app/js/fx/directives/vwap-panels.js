(function() {
  'use strict';
  var TEMPLATE = 'fx/directives/vwap-panels.tpl.html';

  angular.module('i2037.fx.directives.vwapPanels', [TEMPLATE,
    'i2037.fx.directives.priceBig',  
    'i2037.fx.directives.tile'
  ])

  .directive('i2VwapPanels', function() {
    return {
      restrict: 'E',
      templateUrl: TEMPLATE,
      replace: true,
      scope: { quote: '=' },
      link: function($scope, element, attrs) {
      }
    };
  });
}());

