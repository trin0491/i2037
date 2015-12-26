///<reference path="../../../typings/tsd.d.ts" />

import {
    Journal,
    IJournalSummaryResource,
    IMovesProfileResource
  } from "../common/resources/journal";

import movesModel from "../moves/moves-model";
import journalResource from "../common/resources/journal";
import daySummary from "../common/directives/day-summary";

  function pad(n) { return n < 10 ? '0' + n : n; }

  function toLocation(year, month) {
    return "/journal/month/" + year + pad(month + 1);
  }

  export default angular.module('i2037.journal.calendar', [
    'ngRoute',
    'ui.calendar',
    journalResource.name,
    movesModel.name,
    daySummary.name,
    'journal/journal-calendar.tpl.html',
  ])

  .config(['$routeProvider', function($routeProvider:ng.route.IRouteProvider) {
    $routeProvider.when('/journal', {
        redirectTo: function(params, path, search) {
            var now = new Date();
            return toLocation(now.getFullYear(), now.getMonth());
        }
    });
    $routeProvider.when('/journal/month/:month', {
        templateUrl: 'journal/journal-calendar.tpl.html',
        controller: 'JournalCalendarCtrl',
        resolve: {
            date: ['$route', function($route:ng.route.IRouteService) {
                var dStr = $route.current.params.month;
                return { year: dStr.slice(0, 4), month: dStr.slice(4, 6) - 1 };
            }]
        }
    });
    $routeProvider.when('/journal/authorised', {
        templateUrl: 'journal/journal-calendar.tpl.html',
        controller: 'JournalCalendarCtrl',
        resolve: {
            movesProfile: ['$route', 'MovesProfile', function($route:ng.route.IRouteService, movesProfile:IMovesProfileResource) {
                return movesProfile.get($route.current.params).then(function(profile) {
                    if (profile.redirectTo) {
                        window.location.replace(profile.redirectTo);
                    } else {
                        return profile;
                    }
                });
            }],
            date: ['$route', function($route:ng.route.IRouteService) {
                var now = new Date();
                return toLocation(now.getFullYear(), now.getMonth());
            }]
        }
    });
  }])

  .controller('JournalCalendarCtrl', ['$scope', '$rootScope', '$compile', '$location', 'Journal', 'JournalSummary', 'date',
    function($scope, 
      $rootScope:ng.IRootScopeService, 
      $compile:ng.ICompileService, 
      $location:ng.ILocationService,
      journal:Journal,
      JournalSummary:IJournalSummaryResource,
      date) {

      function toEvents(days) {
          return days.map(function(day) {
              var activities = [];
              if (day.activities) {
                  activities = day.activities.filter(function(activity) {
                      return activity.group !== 'transport';
                  });
              }
              return {
                  title: "Moves Summary",
                  start: new Date(day.date),
                  comments: day.comments,
                  activities: activities
              };
          });
      }

      function eventsFn(start, end, callback) {
          if (end > Date.now()) {
              end = new Date();
          }
          JournalSummary.query({ from: start, to: end }).then(function(days) {
              var events = toEvents(days);
              callback(events);
          }, function(response) {
                  var msg = 'Failed to load summary data: status: ' + response.status + ' data: ' + response.data;
                  $rootScope.$broadcast('Resource::LoadingError', 'JOURNAL', msg);
              });
      }

      var events = {};

      function onRenderEvent(event, element, view) {
          var eventStr = '<div i2-day-summary></div>';
          var child = $scope.$new();
          child.event = event;
          child.maxDistance = 10000;
          child.colours = ['#5CADFF', '#3399FF', '#297ACC', '#1F5C99'];
          var el = $compile(eventStr)(child);
          events[event] = child;
          return el;
      }

      function onDestroyEvent(event, element, view) {
          var eventScope = events[event];
          if (eventScope) {
              eventScope.$destroy();
          }
      }

      function onDayClick(date) {
          if (date && date <= Date.now()) {
              var str = journal.toDateString(date);
              $scope.$apply(function() {
                  $location.path('/journal/date/' + str);
              });
          }
      }

      $scope.uiConfig = {
          calendar: {
              height: 450,
              editable: false,
              firstDay: 1,
              year: date.year,
              month: date.month,
              header: {
                  left: 'title',
                  center: '',
                  right: ''
              },
              eventRender: onRenderEvent,
              eventDestroy: onDestroyEvent,
              dayClick: onDayClick,
          }
      };

      $scope.eventSources = [eventsFn];

      $scope.prev = function() {
          var y = date.year;
          var m = date.month;
          m -= 1;
          if (m < 0) {
              y -= 1;
              m = 11;
          }
          $location.path(toLocation(y, m));
      };

      $scope.today = function() {
          var now = new Date();
          $location.path(toLocation(now.getFullYear(), now.getMonth()));
      };

      $scope.next = function() {
          var y = date.year;
          var m = date.month;
          m += 1;
          if (m > 11) {
              y += 1;
              m = 0;
          }
          $location.path(toLocation(y, m));
      };
  }])
  ;