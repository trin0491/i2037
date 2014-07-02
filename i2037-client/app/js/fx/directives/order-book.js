(function() {
  'use strict';
  var TEMPLATE = 'fx/directives/order-book.tpl.html';
  var RUNG_TPL = 'fx/directives/order-book-rung.tpl.html';

  angular.module('i2037.fx.directives.orderBook', [
    TEMPLATE, 
    RUNG_TPL, 
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
        highlight: '=?',
        level: '=?'
      },
      transclude: false,
      link: function($scope, element, attrs) {
        var tbl = element.find('tbody');
        var t = angular.element($templateCache.get(RUNG_TPL));
        if (attrs.align === 'right') {
          var td = t.find('td');
          var depthChart = td.eq(2);
          depthChart.attr("align", "right");
          var tr = td.parent();
          td.remove();
          for (var i=td.length-1;i>=0;--i) {
            tr.eq(0).append(td.eq(i));
          }
        }

        var linkFn = $compile(t);
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
          var cls = [];
          if ($scope.highlight && i < $scope.highlight) {
            cls.push('x-ob-highlight');
          }
          if ($scope.level && i === $scope.level) {
            cls.push('x-ob-normamt-level');
          } else {
            cls.push('x-ob-level');
          }
          return cls;
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

