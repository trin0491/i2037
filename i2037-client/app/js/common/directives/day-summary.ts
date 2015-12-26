///<reference path="../../../../typings/tsd.d.ts" />

export default angular.module('i2037.directives.daySummary', ['common/directives/day-summary.tpl.html', 'i2037.journal.filters'])

  .directive('i2DaySummary', function() {
    return {
      templateUrl: 'common/directives/day-summary.tpl.html',
      replace: false,
      link: function($scope, element, attrs) {

      }
    };
  });


