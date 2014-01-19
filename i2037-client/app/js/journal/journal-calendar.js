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

.controller('JournalCalendarCtrl', ['$scope', '$compile', '$location', 'Journal', 'MovesSummary', 
  function($scope, $compile, $location, Journal, MovesSummary) {

  function eventsFn(start, end, callback) { 
    // var fromStr = Journal.toDateString(start);
    // start.setDate(start.getDate()+30); // hack for now
    // if (start > Date.now()) {
    //   start = new Date();
    // }
    // var toStr = Journal.toDateString(start);
    // MovesSummary.get({from: fromStr, to: toStr}).then(function(summary) {
    //   $scope.summary = summary;
    // });

    // var events = [
    //   {title: 'All Day Event',start: new Date(y, m, 1)},
    //   {title: 'Long Event',start: new Date(y, m, d - 5),end: new Date(y, m, d - 2)},
    //   {id: 999,title: 'Repeating Event',start: new Date(y, m, d - 3, 16, 0),allDay: false},
    //   {id: 999,title: 'Repeating Event',start: new Date(y, m, d + 4, 16, 0),allDay: false},
    //   {title: 'Birthday Party',start: new Date(y, m, d + 1, 19, 0),end: new Date(y, m, d + 1, 22, 30),allDay: false},
    //   {title: 'Click for Google',start: new Date(y, m, 28),end: new Date(y, m, 29),url: 'http://google.com/'}
    // ];
    callback([]);
  }

  var events = {};

  function onRenderEvent(event, element, view) {
    var eventStr = '<div i2-day-summary></div>';      
    var child = $scope.$new();
    child.event = event;
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
      // eventRender: onRenderEvent,
      // eventDestroy: onDestroyEvent,
      dayClick: onDayClick,
    }
  };

  $scope.eventSources = [eventsFn];
}])
;
}());