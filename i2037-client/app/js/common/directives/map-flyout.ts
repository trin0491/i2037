///<reference path="../../../../typings/tsd.d.ts" />
module i2037.directives {
  angular.module('i2037.directives.mapFlyout', ['common/directives/map-flyout.tpl.html'])

  .directive('i2MapFlyout', [function() {
    return {
      template: '<div><p>{{selected.name}}</p></div>',
      replace: false,
      link: function($scope, element, attrs) {

      }
    };
  }]);

}
