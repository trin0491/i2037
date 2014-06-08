(function() {
  'use strict';
  var TEMPLATE = 'fx/directives/quote-panel.tpl.html';

  angular.module('i2037.fx.directives.quotePanel', [TEMPLATE,   
    'i2037.fx.directives.wing',
    'i2037.fx.directives.vwapTiles',
    'i2037.fx.directives.depthChart'
  ])

  .directive('i2QuotePanel', function() {
    return {
      restrict: 'E',
      templateUrl: TEMPLATE,
      replace: true,
      scope: { quote: '=' },
      link: function($scope, element, attrs) {

        $scope.toggleLock = function() {
          $scope.quote.state = ($scope.quote.state === 'locked') ? 'unlocked' : 'locked';
        };     
      }
    };
  });
}());

