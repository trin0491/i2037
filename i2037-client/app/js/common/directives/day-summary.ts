///<reference path="../../../../typings/tsd.d.ts" />

import filters from "../filters";

export default angular.module('i2037.directives.daySummary', [
    'common/directives/day-summary.tpl.html',
    filters.name
  ])

  .directive('i2DaySummary', function () {
    return {
      templateUrl: 'common/directives/day-summary.tpl.html',
      replace: false,
      link: function ($scope, element, attrs) {

      }
    };
  });


