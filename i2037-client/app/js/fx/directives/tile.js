(function() {
  'use strict';
  var TEMPLATE = 'fx/directives/tile.tpl.html';

  angular.module('i2037.fx.directives.tile', [TEMPLATE])

  .directive('i2Tile', function() {

    var CLASSES = {
      unlocked: 'x-tile-dealable',
      locked: 'x-tile-nonDealable',
      traded: 'x-tile-traded'
    };

    return {
      restrict: 'E',
      replace: true,
      templateUrl: TEMPLATE,
      transclude: true,
      link: function($scope, element, attrs) {

        $scope.$watch(attrs.state, function(newState, oldState) {
          if (CLASSES[newState]) {
            if (CLASSES[oldState] && newState !== oldState) {
              attrs.$updateClass(CLASSES[newState], CLASSES[oldState]);                      
            } else {
              attrs.$addClass(CLASSES[newState]);
            }
          }
        }, true);
      }
    };
  });
}());

