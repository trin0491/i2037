(function() {
  'use strict';

  angular.module('i2037.directives.daySummary', ['common/directives/day-summary.tpl.html'])

  .directive('i2DaySummary', function() {
    return {
      templateUrl: 'common/directives/day-summary.tpl.html',
      replace: false,
      link: function($scope, element, attrs) {

      }
    };
  });
}());
