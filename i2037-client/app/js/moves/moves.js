angular.module('i2037.moves', ['i2037.resources.moves'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/moves', {
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
    $scope.isLoading = true;
  });

  $scope.$on('MovesDataLoaded', function() {
    $scope.isLoading = false;
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

.controller('MovesTimelineCtrl', ['$scope', 'Moves', function($scope, Moves) {

  $scope.$on('MovesStorylineLoaded', function(event, response) {
    var entries = [];
    for (var d=0;d<response.length;d++) {
      var segments = response[d].segments;
      for (var s=0;s<segments.length;s++) {
        if (segments[s].type == 'place') {
          entries.push({ 
            date: Moves.fromDateString(segments[s].startTime), 
            text: segments[s].place.name}
          );          
        }       
      }
    }
    $scope.entries = entries;
  });

}])

.controller('MovesCtrl', ['$scope', '$rootScope', '$q', 'Moves', 'MovesStoryline', 'movesProfile',
 function($scope, $rootScope, $q, Moves, MovesStoryline, movesProfile) {

  $scope.movesprofile = movesProfile;
  
  function loadStoryLine(dt) {
    var deferred = $q.defer(); 
    var dateStr = Moves.toDateString(dt)
    MovesStoryline.query({date: dateStr}, function(response) {
      deferred.resolve(response);
    }, function(httpResponse) {
      deferred.reject("failed");
    });
    return deferred.promise;
  };

  function onDateChanged(date) {
    $rootScope.$broadcast('MovesDataLoading');
    var p = loadStoryLine(date).then(function (storyLine) {
      $rootScope.$broadcast('MovesStorylineLoaded', storyLine);
      $rootScope.$broadcast('MovesDataLoaded');      
    }, function(error) {
      // TODO error
      $rootScope.$broadcast('MovesDataLoaded');
    });
  }

  $scope.$on('DateChanged', function(event, date) {
    onDateChanged(date);
  });
}])

.controller('MovesMapCtrl', ['$scope', '$q', '$location', '$compile',
 function($scope, $q, $location, $compile) {
  var colours = {
    'wlk': '#FF0000',
    'run': '#FF0000',    
    'cyc': '#00FF00',
    'trp': '#585858'
  };

  var markers = [];
  var overlays = [];
  var map;
  var infoWindow = new google.maps.InfoWindow();

  function getMap() {
    var mapOptions = {
      center: new google.maps.LatLng(51.46044, -0.29745),
      zoom: 12,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(
        document.getElementById("map-canvas"),
        mapOptions
    );
    return map;
  };

  function addMarker(segment) {
    var lat = segment.place.location.lat;
    var lon = segment.place.location.lon;
    var name = segment.place.name ? segment.place.name : "Unknown";

    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(lat, lon),
        map: map,
        title: name
    });

    google.maps.event.addListener(marker, 'click', function() {
      var contentStr = '<div ng-include="\'partials/moves-place.html\'"></div>';
      var elements = $compile(contentStr)($scope);      
      $scope.$apply(function(scope) {
        scope.place = segment;
      });
      infoWindow.setContent(elements[0]);
      infoWindow.open(map, marker);      
    });

    markers.push(marker);        
  };

  function addPath(move) {
    for (var a in move.activities) {
      var activity = move.activities[a];
      var points = [];
      var trackPoints = activity.trackPoints;
      for (var t in trackPoints) {
        points.push(
          new google.maps.LatLng(trackPoints[t].lat, trackPoints[t].lon)
        );
      }

      var path = new google.maps.Polyline({
        path: points,
        strokeColor: colours[activity.activity],
        strokeOpacity: 1.0,
        strokeWeight: 2
      });

      overlays.push(path);
      path.setMap(map);      
    }
  };

  function setCenter(marker) {
    map.setCenter(marker.position);
  };

  $scope.$on('MovesStorylineLoaded', function(event, response) {
      $scope.clearMap();

      for (var d=0;d<response.length;d++) {
        var segments = response[d].segments;
        for (var s=0;s<segments.length;s++) {
          if (segments[s].type == 'place') {
            addMarker(segments[s]);
          } else if (segments[s].type == 'move') {
            addPath(segments[s]);
          }       
        }
      }

      if (markers.length > 0) {
        setCenter(markers[0]);
      }
  });

  $scope.clearMap = function() {
    for (var i in markers) {
      markers[i].setMap(null);
    }
    markers.length = 0;
    for (var i in overlays) {
      overlays[i].setMap(null);
    }
    overlays.length = 0;
  };

  map = getMap();
}])

;
