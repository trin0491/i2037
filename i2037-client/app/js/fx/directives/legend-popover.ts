///<reference path="../../../../typings/tsd.d.ts" />
const TEMPLATE = 'js/fx/directives/legend-popover.tpl.html';

export default angular.module('i2037.fx.directives.legendPopover', [
    TEMPLATE
  ])

  .directive('i2LegendPopover', ['$templateCache', function ($templateCache) {
    return {
      replace: false,
      link: function ($scope, element, attrs) {
        var t = $templateCache.get(TEMPLATE);

        var options = {
          trigger: 'click',
          delay: 500,
          placement: 'bottom',
          title: "Not Used",
          content: "Not Used",
          template: t
        };
        element.popover(options);
      }
    };
  }]);

