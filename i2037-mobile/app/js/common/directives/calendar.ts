///<reference path="../../../../typings/tsd.d.ts" />

import Moment = moment.Moment;

export = CalendarModule

class CalendarModule {
  public static NAME:string = 'i2037.directives.calendar';

  private static _instance:CalendarModule = new CalendarModule();

  public get instance():CalendarModule {
    return CalendarModule._instance;
  }

  constructor() {
    var m = angular.module(CalendarModule.NAME, [])

    m.directive('i2Calendar', [function () {

      var START_DAY = 1;

      return {
        restrict: 'E',
        scope: {
          //selected: '=i2Selected'
        },
        templateUrl: 'templates/calendar.tpl.html',
        link: function ($scope:CalendarScope, element:ng.IAugmentedJQuery, attrs:ng.IAttributes) {

          function render(selected:Moment) {
            renderHeading(selected);
            renderWeeks(selected);
          }

          function renderHeading(selected:Moment) {
            $scope.selected = selected;
          }

          function renderWeeks(selected:Moment) {
            $scope.weeks = [];
            var start = selected.clone().startOf('month').day(START_DAY);
            for (var w = 0; w < 5; ++w) {
              renderWeek(start);
            }
          }

          function renderWeek(day:Moment) {
            var week = [];
            for (var d = 0; d < 7; ++d) {
              week.push(day.clone());
              day.add(1, 'd');
            }
            $scope.weeks.push(week);
          }

          render(moment());
        }
      }
    }]);
  }
}

interface CalendarScope extends ng.IScope {
  selected: Moment;
  weeks: Array<Array<Moment>>;
}
