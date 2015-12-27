///<reference path="../../../../typings/tsd.d.ts" />
export default angular.module('i2037.directives.mapFlyout', ['js/common/directives/map-flyout.tpl.html'])

  .directive('i2MapFlyout', [function() {
    return {
      template: '<div><p>{{selected.name}}</p></div>',
      replace: false,
      link: function($scope, element, attrs) {

      }
    };
  }]);


