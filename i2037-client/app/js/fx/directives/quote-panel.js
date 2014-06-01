(function() {
  'use strict';
  var TEMPLATE = 'fx/directives/quote-panel.tpl.html';

  angular.module('i2037.fx.directives.quotePanel', [TEMPLATE,   
    'i2037.fx.directives.wing',
    'i2037.fx.directives.vwapPanels',
  ])

  .directive('i2QuotePanel', function() {
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

