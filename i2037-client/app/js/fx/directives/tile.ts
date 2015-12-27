///<reference path="../../../../typings/tsd.d.ts" />
var TEMPLATE = 'js/fx/directives/tile.tpl.html';

export default angular.module('i2037.fx.directives.tile', [TEMPLATE])

  .directive('i2Tile', function () {

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
      link: function ($scope, element, attrs:ng.IAttributes) {

        $scope.$watch(attrs['state'], function (newState, oldState) {
          if (CLASSES[newState]) {
            if (CLASSES[oldState] && newState !== oldState) {
              attrs.$removeClass(CLASSES[oldState]);
              attrs.$addClass(CLASSES[newState]);
            } else {
              attrs.$addClass(CLASSES[newState]);
            }
          }
        }, true);
      }
    };
  });

