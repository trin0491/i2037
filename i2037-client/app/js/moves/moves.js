angular.module('i2037.moves', ['i2037.services'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/moves', {templateUrl: 'partials/moves.html', controller: 'MovesCtrl'});    
}])

.controller('DatePickerCtrl', ['$scope', '$timeout', function ($scope, $timeout) {
  $scope.today = function() {
    $scope.dt = new Date();
  };
  $scope.today();

  $scope.minDate = '2000-01-01';
  $scope.maxDate = new Date();

  $scope.showWeeks = true;

  $scope.disabled = function(date, mode) {
    return false; // Disable weekend selection ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
  };

  $scope.open = function() {
    $timeout(function() {
      $scope.opened = true;
    });
  };

  $scope.submit = function() {
    if ($scope.dt) {
      $scope.isLoading = true;
      $scope.getStoryline($scope.dt).then(function() {
        $scope.isLoading = false;
      });      
    }
  };

  $scope.dateOptions = {
    'year-format': "'yy'",
    'starting-day': 1
  };
}])

.controller('MovesCtrl', ['$scope', '$q', 'MovesSummary', 'MovesStoryline', 'MovesProfile',
 function($scope, $q, MovesSummary, MovesStoryline, MovesProfile) {
  var colours = {
    'wlk': '#FF0000',
    'run': '#FF0000',    
    'cyc': '#00FF00',
    'trp': '#ACACAC'
  };

  var markers = [];
  var overlays = [];

  var mapOptions = {
    center: new google.maps.LatLng(51.46044, -0.29745),
    zoom: 12,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  var map = new google.maps.Map(
      document.getElementById("map-canvas"),
      mapOptions
  );

  function addMarker(segment) {
    var lat = segment.place.location.lat;
    var lon = segment.place.location.lon;
    var name = segment.place.name ? segment.place.name : "Unknown";

    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(lat, lon),
        map: map,
        title: name
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

  function getMovesProfile() {
    $scope.movesprofile = MovesProfile.query();
  };

  getMovesProfile();

  $scope.getStoryline = function(dt, callback) {
    var deferred = $q.defer(); 

    function pad(n){return n<10 ? '0'+n : n};
    var y = dt.getFullYear().toString();
    var m = pad(dt.getMonth() + 1).toString();
    var d = pad(dt.getDate()).toString();

    MovesStoryline.query({date: y + m + d}, function(response) {
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

      deferred.resolve("success");
    }, function(httpResponse) {
      deferred.reject("failed");
    });
    return deferred.promise;
  };

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
}]);
