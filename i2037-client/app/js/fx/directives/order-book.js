(function() {
  'use strict';
  var TEMPLATE = 'fx/directives/order-book.tpl.html';
  var RUNG_TPL_LEFT = 'fx/directives/order-book-rung-left.tpl.html';
  var RUNG_TPL_RIGHT = 'fx/directives/order-book-rung-right.tpl.html';

  angular.module('i2037.fx.directives.orderBook', [
    TEMPLATE, 
    RUNG_TPL_LEFT, 
    RUNG_TPL_RIGHT,
    'i2037.fx.directives.depthChart'    
  ])

  .directive('i2OrderBook', ['$templateCache', '$compile', 
    function($templateCache, $compile) {
    return {
      restrict: 'E',
      templateUrl: TEMPLATE,
      replace: true,
      scope: {
        ob: '=',
        highlight: '=?'
      },
      transclude: false,
      link: function($scope, element, attrs) {
        var tbl = element.find('tbody');
        var t = (attrs.align === 'right') ? RUNG_TPL_RIGHT : RUNG_TPL_LEFT;

        var linkFn = $compile($templateCache.get(t));
        var children = [];

        $scope.$watch('ob.rungs', function(rungs) {
          tbl.empty();
          children.forEach(function(scope) {
            scope.$destroy();
          });
          children = [];

          function appendToDom(clone) {
            tbl.append(clone);            
          }

          for (var i=0;i<rungs.length;++i) {
            var child = $scope.$new();
            children.push(child);
            child.rung = rungs[i];
            child.index = i;
            linkFn(child, appendToDom);           
          }
        });

        $scope.getRowCls = function(i) {
          if ($scope.highlight && i < $scope.highlight) {
            return 'x-ob-highlight';
          }
        };

        $scope.onHover = function(i) {
          $scope.highlight = i+1;
        };

        $scope.onLeave = function(i) {
          $scope.highlight = 0;
        };
      }
    };
  }]);
}());

