(function() {
  'use strict';
  var TEMPLATE = 'fx/directives/tile.tpl.html';

  angular.module('i2037.fx.directives.tile', [TEMPLATE])

  .directive('i2Tile', function() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: TEMPLATE,
      scope: {},
      transclude: true,
      link: function($scope, element, attrs) {
        attrs.$addClass('x-tile-dealable');
      }
    };
  });
}());

