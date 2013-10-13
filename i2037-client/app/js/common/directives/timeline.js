
angular.module('i2037.directives.timeline', [])

.directive('i2Timeline', function() {
  return {
    scope: {
      entries: '=i2Timeline',
      selected: '=i2Selected'
    },
    template: '<table class="table table-bordered"><tbody>'
      + '<tr ng-repeat="entry in entries" ng-class="{info: isSelected(entry)}" ng-click="onClick(entry)">'
      + '<td>{{entry.date | date:"HH:mm"}}hrs</td><td>{{entry.text}}</td>'
      + '</tr></tbody></table>',

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
    }
  }
})
;