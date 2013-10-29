angular.module('i2037.moves', [
  'i2037.resources.moves',
  'i2037.resources.foursquare',
  'i2037.moves.model',
  'i2037.directives.map',
  'i2037.directives.timeline',
  'i2037.directives.spinner',
  'i2037.directives.button'
])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/journal', {
    templateUrl: 'partials/moves.html',
    controller: 'MovesCtrl',
    resolve: {
      movesProfile: function($route, MovesProfile) {
        return MovesProfile.get($route.current.params).then(function (profile) {
            if (profile.redirectTo) {
              window.location.replace(profile.redirectTo);
            } else {
              return profile;
            }
        })
      } 
    }
  });    
}])

.controller('MovesCtrl', ['$scope', '$rootScope', '$q', 'Moves', 'MovesStoryline', 'MovesPlacesModel', 'MovesPathsModel', 'movesProfile',
 function($scope, $rootScope, $q, Moves, MovesStoryline, MovesPlacesModel, MovesPathsModel, movesProfile) {

  $scope.movesprofile = movesProfile;
  
  function processResponse(response) {
    var places = [];
    var paths = [];

    for (var d=0;d<response.length;d++) {
      var segments = response[d].segments;
      for (var s=0;s<segments.length;s++) {
        if (segments[s].type == 'place') {
          var place = segments[s].place;
          place.startTime = segments[s].startTime;
          place.endTime = segments[s].endTime;
          places.push(place);
        } else if (segments[s].type == 'move') {
          for (var a in segments[s].activities) {
            var activity = segments[s].activities[a];
            paths.push(activity);
          }
        }       
      }
    }
    MovesPlacesModel.setPlaces(places);
    MovesPathsModel.setPaths(paths);    
  }

  function loadStoryLine(dt) {
    var deferred = $q.defer(); 
    var dateStr = Moves.toDateString(dt)
    MovesStoryline.query({date: dateStr}, function(response) {
      processResponse(response);
      deferred.resolve(response);
    }, function(error) {
      deferred.reject("failed");
    });
    return deferred.promise;
  };

  function onDateChanged(date) {
    $rootScope.$broadcast('MovesDataLoading');
    var p = loadStoryLine(date).then(function (storyLine) {
      $rootScope.$broadcast('MovesDataLoaded');      
    }, function(error) {
      $rootScope.$broadcast('MovesDataLoaded');
    });
  }

  $scope.$on('DateChanged', function(event, date) {
    onDateChanged(date);
  });
}])

.controller('DatePickerCtrl', ['$scope', '$rootScope', '$timeout', function ($scope, $rootScope, $timeout) {
  $scope.minDate = '2000-01-01';
  $scope.maxDate = new Date();
  $scope.showWeeks = true;
  $scope.dateOptions = {
    'year-format': "'yy'",
    'starting-day': 1
  };

  $scope.disabled = function(date, mode) {
    return false; 
  };

  $scope.open = function() {
    $timeout(function() {
      $scope.opened = true;
    });
  };

  $scope.submit = function() {
    if ($scope.dt) {
      $rootScope.$broadcast("DateChanged", $scope.dt);    
    }
  };

  $scope.$on('MovesDataLoading', function() {
    $scope.state = 'LOADING';
  });

  $scope.$on('MovesDataLoaded', function() {
    $scope.state = 'default';
  });

  $scope.dt = new Date();
}])

.controller('MovesSummaryCtrl', ['$scope', 'Moves', 'MovesSummary', function($scope, Moves, MovesSummary) {  
  $scope.$on('DateChanged', function(event, date) {
    var dateStr = Moves.toDateString(date);
    MovesSummary.get({date: dateStr}).then(function(summary) {
      $scope.summary = summary;
    });
  });
}])

.controller('MovesTimelineCtrl', ['$scope', 'Moves', 'MovesPlacesModel', function($scope, Moves, MovesPlacesModel) {

  $scope.$on('MovesPlacesModel::CollectionChange', function(event, model) {
    var entries = [];
    var places = model.getPlaces();
    for (var i in places) {
      var place = places[i];
      var entry = { 
        date: Moves.fromDateString(places[i].startTime), 
        text: place.name,
        place: place,
        comments: []
      };
      entries.push(entry);          
    }
    $scope.entries = entries;
  });

  $scope.$on('MovesPlacesModel::SelectedChange', function(e, model) {
    var selectedPlace = model.getSelected();
    $scope.entries.some
    for (var i=0;i<$scope.entries.length;++i) {
      if ($scope.entries[i].place === selectedPlace) {
        $scope.selected = $scope.entries[i];        
      }
    }
  })

  $scope.$watch('selected', function(newSelection, oldSelection) {
    if (newSelection) {
      MovesPlacesModel.setSelected(newSelection.place);      
    } else {
      MovesPlacesModel.setSelected(undefined);
    }
  });

}])

.controller('TimelineEntryCtrl', ['$scope', 'FourSquareVenue', function($scope, FourSquareVenue) {
  $scope.isCollapsed = true;
  $scope.showSpinner = false;

  $scope.toggleCollapse = function(entry) {
    $scope.isCollapsed = !$scope.isCollapsed;
    if(entry.place.type == 'foursquare') {
      if (!entry.venue) {
        $scope.showSpinner = true;
        FourSquareVenue.get(entry.place.foursquareId).then(function(venue) {
          entry.venue = {
            type: 'Foursquare',
            phone: venue.contact.phone,
            formattedPhone: venue.contact.formattedPhone,
            canonicalUrl: venue.canonicalUrl,
            url: venue.url
          }
          var location = venue.location;
          if (location) {
            var a = ['address', 'city', 'state', 'postalCode', 'country'];
            var addr = a.map(function(property) { if (location.hasOwnProperty(property)) return location[property] });
            entry.venue.address = addr.join(', ');
          }        
          $scope.showSpinner = false;          
        }, function(error) {
          $scope.showSpinner = false;
        });
      }        
    } else {
      entry.venue = {
        type: 'Moves'
      };
    }
  }
}])

.controller('MovesMapCtrl', ['$scope', 'MovesPlacesModel', function($scope, MovesPlacesModel) {
  $scope.$on('MovesPlacesModel::CollectionChange', function(e, model) {
    $scope.places = model.getPlaces();
  });

  $scope.$on('MovesPathsModel::CollectionChange', function(e, model) {
    $scope.paths = model.getPaths();
  });

  $scope.$on('MovesPlacesModel::SelectedChange', function(e, model) {
    $scope.selected = model.getSelected();
  })

  $scope.$watch('selected', function(newSelection, oldSelection) {
    if (newSelection) {
      MovesPlacesModel.setSelected(newSelection);
    } else {
      MovesPlacesModel.setSelected(undefined);
    }
  })
}])

;
