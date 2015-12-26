///<reference path="../../../../typings/tsd.d.ts" />
var TEMPLATE = 'fx/directives/vwap-tiles.tpl.html';

import priceVwap from "./price-vwap";
import tile from "./tile";

export default angular.module('i2037.fx.directives.vwapTiles', [TEMPLATE,
    priceVwap.name,
    tile.name
  ])

  .directive('i2VwapTiles', function () {
    return {
      restrict: 'E',
      templateUrl: TEMPLATE,
      replace: true,
      link: function ($scope, element, attrs) {
      }
    };
  });

