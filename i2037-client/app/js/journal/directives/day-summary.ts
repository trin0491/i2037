///<reference path="../../../../typings/tsd.d.ts" />

export default angular.module('i2037.directives.daySummary', [])

  .directive('i2DaySummary', function () {
    return {
      templateUrl: 'js/journal/templates/day-summary.tpl.html',
      replace: false,
      link: function ($scope, element, attrs) {

      }
    };
  });


