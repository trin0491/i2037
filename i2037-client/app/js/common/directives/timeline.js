
angular.module('i2037.directives.timeline', ['common/directives/timeline.tpl.html'])

.directive('i2Timeline', ['$compile', function($compile) {
  return {
    transclude: true,
    replace: true,
    scope: {
      selected: '=i2Selected',
      timeline: '=i2Timeline'
    },
    templateUrl: 'common/directives/timeline.tpl.html',

    compile: function(element, attrs, linker) {

      var headerLinker = $compile('<tr><td colspan="2"><h4>{{entry.date | date:"EEEE d MMMM"}}</h4></td></tr>');
      var entryLinker = $compile('<tr ng-class="{info: isSelected(entry)}" ng-click="onClick(entry)"><td>{{entry.date | date:"HH:mm"}}</td><td></td></tr>');

      return function postLink(scope, element, attrs) {
        var tbody = element.find('tbody');
        var lastRows = [];

        scope.isSelected = function(entry) {
          return entry === scope.selected;
        };

        scope.onClick = function(entry) {
          if (scope.isSelected(entry)) {
            scope.selected = undefined;
          } else {
            scope.selected = entry;
          }
        };

        function isNewDay(prevEntry, nextDate) {
          if (!prevEntry) {
            return true;
          }
          // assumes that dates are in order otherwise this won't work
          if (nextDate.getDate() !== prevEntry.getDate()) {
            return true;
          } else {
            return false;
          }
        }

        function Row(element, scopes) {
          this.element = element;
          this.scopes = scopes;
        }

        function appendHeaderRow(entry) {
          var childscope = scope.$new();
          childscope.entry = entry;
          headerLinker(childscope, function(clone) {
            tbody.append(clone);
            lastRows.push(new Row(clone, [childscope]));                    
          });
        }

        function appendEntryRow(entry) {
          var childscope = scope.$new();
          childscope.entry = entry;            
          entryLinker(childscope, function(tr) {
            tbody.append(tr);
            var theirScope = scope.$parent.$new();
            theirScope['entry'] = entry;
            linker(theirScope, function(clone) {
              tr.find('td').eq(1).append(clone);
            });
            lastRows.push(new Row(tr, [childscope, theirScope]));                                  
          });
        }

        function removeRows(rows) {
          for (var r=0;r<rows.length;++r) {
            rows[r].element.remove();
            for (var s=0;s<s.length;++s) {
              row[r].scopes[s].$destroy();              
            }
          }
          rows.length = 0;          
        }

        scope.$watch('timeline.length', function() {
          var entries = scope.timeline;
          removeRows(lastRows);
          var prevDate;
          angular.forEach(entries, function(entry) {
            if (isNewDay(prevDate, entry.date)) {
              appendHeaderRow(entry);
            }
            appendEntryRow(entry);
            prevDate = entry.date;
          });
        });       
      };
    }
  };
}])
;