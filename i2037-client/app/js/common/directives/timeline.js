
angular.module('i2037.directives.timeline', [])

.directive('i2Timeline', function() {
  return {
    scope: {
      timeline: '=i2Timeline',
      selected: '=i2Selected'
    },
    template: '<table class="table"><tbody ng-repeat="entry in entries" ng-switch="entry.isHeader">'
      + '<tr ng-switch-when="true">'
      + '<td colspan="2"><h4>{{entry.date | date:"EEEE d MMMM"}}</h4></td>'
      + '</tr>'
      + '<tr ng-switch-default ng-class="{info: isSelected(entry)}" ng-click="onClick(entry)">'
      + '<td>{{entry.date | date:"HH:mm"}}</td><td>{{entry.text}}</td>'
      + '</tr>'
      + '</tbody></table>',

    link: function(scope, element, attrs) {
      scope.isSelected = function(entry) {
        return entry === scope.selected;
      }

      scope.onClick = function(entry) {
        if (scope.isSelected(entry)) {
          scope.selected = undefined;
        } else {
          scope.selected = entry;
        }
      }

      function isNewDay(prevEntry, nextDate) {
        if (!prevEntry) {
          return true;
        }
        // assumes that dates are in order otherwise this won't work
        if (nextDate.getDate() != prevEntry.getDate()) {
          return true;
        } else {
          return false;
        }
      }

      scope.$watch('timeline.length', function() {
        var entries = [];
        var prevDate;
        angular.forEach(scope.timeline, function(entry) {
          if (isNewDay(prevDate, entry.date)) {
            entries.push({date: entry.date, isHeader:true});
          }
          entries.push(entry);
          prevDate = entry.date;
        });
        scope.entries = entries;
      });
    }
  }
})
;