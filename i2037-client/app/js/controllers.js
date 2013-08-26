'use strict';

/* Controllers */
function WineViewCtrl($scope, $dialog, Wine) {

  function refresh() {
    $scope.wines = Wine.query();    
  };

  function createOrUpdate(wine) {
    var opts = {
        backdrop: true,
        keyboard: true,
        dialogFade: true,
        backdropClick: true,
        templateUrl: 'partials/wineform.html', 
        controller: 'WineFormCtrl',
        resolve: { 
          wine: function() { 
            return wine;
          }
        }
    };

    var d = $dialog.dialog(opts);
    d.open().then(function(wine){
      wine.$save({}, function() {
        refresh();
      });
    });
  };

  function noRows(wines, winesPerRow) {
    if (wines && winesPerRow) {
      return Math.ceil(wines.length / winesPerRow);
    } else {
      return 0;
    }
  };

  function layoutGrid(wines, winesPerRow) {
    var winePM = [];
    for (var row = 0; row < noRows(wines, winesPerRow); row++) {
      winePM[row] = [];
      var offset = row * winesPerRow;
      for (var i = 0; i < winesPerRow && offset + i < wines.length; i++) {
        winePM[row][i] = wines[offset + i];
      }
    }
    $scope.wineGrid = winePM;
  };

  $scope.smallThumbnails = function() {
    $scope.wineCls = 'span3';
    $scope.winesPerRow = 4;
  };

  $scope.largeThumbnails = function() {
    $scope.wineCls = 'span4';
    $scope.winesPerRow = 3;
  };

  $scope.edit = function(wine) {
    var copy = angular.copy(wine);
    createOrUpdate(copy);
  };

  $scope.add = function() {
    var wine = new Wine({ rating: 0 });
    createOrUpdate(wine);
  };

  $scope.delete = function(wine) {
    wine.$delete();
  };

  $scope.refresh = function() {
    refresh();
  };

  $scope.noRows = function() {
    return noRows($scope.wines, $scope.winesPerRow);
  };

  $scope.$watch('wines', function(newWines) {
    layoutGrid(newWines, $scope.winesPerRow);
  }, true);

  $scope.$watch('winesPerRow', function(newWinesPerRow) {
    layoutGrid($scope.wines, newWinesPerRow);
  }, true);

  $scope.winesPerRow = 4;
  $scope.wineCls = 'span3';
  $scope.refresh();
}
WineViewCtrl.$inject = ['$scope', '$dialog', 'Wine'];

function WineFormCtrl($scope, dialog, wine, Grape) {
  $scope.wine = wine;
  $scope.isNewGrape = false;
  $scope.grapeName = null;
  $scope.grapes = Grape.query();

  $scope.$watch("grapes.length", function(length) {
    angular.forEach($scope.grapes, function(grape) {
      if (wine.grapeId == grape.grapeId) {
        $scope.grapeName = grape.name;
      }
    });
  });

  $scope.$watch('grapeName', function(newGrapeName, oldGrapeName) {
    if (newGrapeName) {
      onGrapeChanged();
    }
  });

  function onGrapeChanged() {
    var grape = findGrape($scope.grapeName);
    if (grape) {
      wine.grapeId = grape.grapeId;
      $scope.isNewGrape = false;
    } else {
      wine.grapeId = undefined;
      $scope.isNewGrape = true;
    }      
  };

  function findGrape(grapeName) {
    var rv;
    angular.forEach($scope.grapes, function(grape) {
      if (grape.name == grapeName) {
         rv = grape;
      }
    });
    return rv;    
  };

  $scope.addGrape = function() {
    if (!$scope.isNewGrape) {
      return;
    }
    var grape = new Grape({name: $scope.grapeName});
    grape.$save({}, function() {
      onGrapeChanged();
    });
  };

  $scope.cancel = function() {
    dialog.close();
  };

  $scope.submit = function() {
    if ($scope.isNewGrape) {
      return;
    }
    dialog.close($scope.wine);
  }
};
WineFormCtrl.$inject = ['$scope', 'dialog', 'wine', 'Grape'];

function NavBarCtrl($scope, $location, $dialog, User, Session) {
  $scope.user = null;
  $scope.$location = $location;

  function setMenuVisibility(user) {
    var isLoggedIn = user != null;
    $scope.showCellar = isLoggedIn;
    $scope.showCage = isLoggedIn;
    $scope.showLogin = !isLoggedIn;
    $scope.showLogout = isLoggedIn;
  }
  setMenuVisibility($scope.user);
  $scope.$watch("user", setMenuVisibility);

  Session.on('authFailure', function() {
    $scope.login();
  });

  $scope.login = function() {
    var opts = {
        backdrop: true,
        keyboard: true,
        dialogFade: true,
        backdropClick: true,
        templateUrl: 'partials/loginform.html', 
        controller: 'LoginFormCtrl',
        resolve: {
          userName: function() {
            if ($scope.user && $scope.user.userName) {
              return $scope.user.userName;  
            } else {
              return null;
            }              
          }
        }
    };

    var loginForm = $dialog.dialog(opts);
    loginForm.open().then(function(user){
      if(user) {        
        $scope.user = user;
      }
    });
  };

  $scope.logout = function() {
    User.logout().success(function(data, status) {
      $scope.user = null;
    }).error(function(data, status) {
      alert("Failed to logout");
    }); 
  };

  $scope.getAccountLabel = function() {
    if ($scope.user && $scope.user.userName) {
      return $scope.user.userName;      
    } else {
      return 'My Account';      
    }
  };

  $scope.user = User.get();
}
NavBarCtrl.$inject = ['$scope', '$location', '$dialog', 'User', 'Session'];

function LoginFormCtrl($scope, dialog, User, userName) {
  $scope.rememberMe = true;
  if (userName) {
    $scope.title = 'Change Password'
    $scope.userName = userName;
    $scope.userNameReadonly = true;
  } else {
    $scope.title = 'Login';
    $scope.userName = $.cookie('userName');
  }

  $scope.cancel = function(){
    dialog.close();
  };

  $scope.submit = function() {
    if ($scope.rememberMe && $scope.userName) {
      $.cookie('userName', $scope.userName, { expires: 7 });
    } else {
      $.cookie.removeCookier('userName');
    }

    User.login($scope.userName, $scope.password).success(function(user, status) {
      dialog.close(user);
    }).error(function(data, status) {
      alert("Failed to authenticate");
    });
  }
}
LoginFormCtrl.$inject = ['$scope', 'dialog', 'User', 'userName'];

function HomeCtrl() {}
HomeCtrl.$inject = [];
 
function DatePickerCtrl($scope, $timeout) {
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

  $scope.ok = function() {
    $scope.queryMoves($scope.dt);
  };

  $scope.dateOptions = {
    'year-format': "'yy'",
    'starting-day': 1
  };
};
DatePickerCtrl.$inject = ['$scope', '$timeout'];


function SlickgridCtrl($scope, MovesSummary, MovesPlaces, MovesStoryline) {
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

  function drawChart(rows) {
    var chart = new Highcharts.Chart({
      chart: {
        type: 'line',
        renderTo: 'graph'
      },
      title: {
          text: 'Distance Travelled',
      },
      subtitle: {
          text: 'Source: moves-app.com',
      },
      xAxis: {
          categories: rows.map(function(row) {
            return row.date;
          }),
          // tickInterval: 5
      },
      yAxis: {
          title: {
              text: 'Distance (m)'
          },
      },
      tooltip: {
          valueSuffix: 'm'
      },
      legend: {
          layout: 'vertical',
          align: 'right',
          verticalAlign: 'middle'
      },
      series: [{
          name: 'Walk',
          data: rows.map(function(row) {
            return row.wlk ? row.wlk : 0;
          })
      }]      
    });
  };

  function drawGraph(response) {
    var columns = [
      {id: "date", name: "Date", field: "date", width:100},
      {id: "walk", name: "Walk (m)", field: "wlk", width:100},
      {id: "run", name: "Run (m)", field: "run", width:100},
      {id: "cycle", name: "Cycle (m)", field: "cyc", width:100},
    ];

    var rows = [];
    for (var i = 0; i < response.length; i++) {
      var day = response[i];
      if (day.summary) {        
        var row = {date: day.date};
        for(var n=0;n<day.summary.length;n++) {
          row[day.summary[n].activity] = day.summary[n].distance;
        }
        rows.push(row);
      }
    };
    var grid = new Slick.Grid('#myGrid', rows, columns, {
      enableCellNavigation: true,
      enableColumnReorder: false
    });

    drawChart(rows);    
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

  $scope.queryMoves = function(dt) {
    if (!dt) {
      return;
    }

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
  };
}
SlickgridCtrl.$inject = ['$scope', 'MovesSummary', 'MovesPlaces', 'MovesStoryline'];

function RecipesCtrl($scope) {
};
RecipesCtrl.$inject = ['$scope'];