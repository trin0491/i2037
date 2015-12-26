///<reference path="../../../../typings/tsd.d.ts" />
var TEMPLATE = 'fx/directives/quote-panel.tpl.html';

import orderBook from "./order-book";
import vwapTiles from "./vwap-tiles";

interface IQuotePanelScope extends ng.IScope {
  toggleLock():void;
  quote:any;
}

export default angular.module('i2037.fx.directives.quotePanel', [TEMPLATE,
    orderBook.name,
    vwapTiles.name
  ])

  .directive('i2QuotePanel', function () {
    return {
      restrict: 'E',
      templateUrl: TEMPLATE,
      replace: true,
      scope: {quote: '='},
      link: function ($scope:IQuotePanelScope, element, attrs) {

        $scope.toggleLock = function () {
          $scope.quote.state = ($scope.quote.state === 'locked') ? 'unlocked' : 'locked';
        };
      }
    };
  });

