(function() {
  'use strict';
  var TEMPLATE = 'fx/directives/wing.tpl.html';

  angular.module('i2037.fx.directives.wing', [TEMPLATE,
    'i2037.fx.directives.tile',
    'i2037.fx.directives.rung'
  ])

  .directive('i2Wing', function() {
    return {
      restrict: 'E',
      templateUrl: TEMPLATE,
      replace: true,
      transclude: true,
      link: function($scope, element, attrs) {
      }
    };
  });
}());

