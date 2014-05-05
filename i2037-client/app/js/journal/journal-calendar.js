(function() {

angular.module('i2037.journal.calendar', [
  'ngRoute',
  'i2037.resources.journal',
  'i2037.moves.model',
  'i2037.directives.daySummary',
  'ui.calendar',
  'journal/journal-calendar.tpl.html',     
])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/journal', {
    templateUrl: 'journal/journal-calendar.tpl.html',
    controller: 'JournalCalendarCtrl',
    resolve: {
      movesProfile: ['$route', 'MovesProfile', function($route, MovesProfile) {
        return MovesProfile.get($route.current.params).then(function (profile) {
            if (profile.redirectTo) {
              window.location.replace(profile.redirectTo);
            } else {
              return profile;
            }
        });
      }],
      date: function() {
        return new Date();
      } 
    }
  });
}])

.controller('JournalCalendarCtrl', ['$scope', '$rootScope', '$compile', '$location', 'Journal', 'JournalSummary', 
  function($scope, $rootScope, $compile, $location, Journal, JournalSummary) {

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
    JournalSummary.query({from: start, to: end}).then(function(days) {
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
      var str = Journal.toDateString(date);
      $scope.$apply(function() {
        $location.path('/journal/date/'+ str);        
      });
    }    
  }

  $scope.uiConfig = {
    calendar:{
      height: 450,
      editable: false,
      header:{
        left: 'title',
        center: '',
        right: 'today prev,next'
      },
      eventRender: onRenderEvent,
      eventDestroy: onDestroyEvent,
      dayClick: onDayClick,
    }
  };

  $scope.eventSources = [eventsFn];
}])
;
}());