 /* Controllers */

angular.module('i2037.cellar', ['ngRoute', 'i2037.resources.cellar'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/cellar',  { templateUrl: 'partials/wineview.html', controller: 'ListWineCtrl' });
    $routeProvider.when('/cellar/wines',  { templateUrl: 'partials/wineview.html', controller: 'ListWineCtrl' });
    $routeProvider.when('/cellar/wines/new',  {
      templateUrl: 'partials/wineform.html',
      controller: 'EditWineCtrl',
      resolve: {
        wine: ['Wine', function(Wine) {
          return new Wine({ rating: 0 });  //TODO default in constructor when replace with $http service
        }]
      }
    });
    $routeProvider.when('/cellar/wines/:wineid',  {
      templateUrl: 'partials/wineform.html',
      controller: 'EditWineCtrl',
      resolve: {
        wine: ['$route', 'Wine', function($route, Wine) {
          return Wine.get({wineId:$route.current.params.wineid});
        }]
      }
    });
    $routeProvider.when('/cellar/grapes', { templateUrl: 'partials/grapes.html', controller: 'ListGrapesCtrl' });
}])

.controller('ListWineCtrl', ['$scope', '$location', 'Wine', function($scope, $location, Wine) {

  function refresh() {
    $scope.wines = Wine.query();    
  }

  function noRows(wines, winesPerRow) {
    if (wines && winesPerRow) {
      return Math.ceil(wines.length / winesPerRow);
    } else {
      return 0;
    }
  }

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
  }

  $scope.smallThumbnails = function() {
    $scope.wineCls = 'col-md-3';
    $scope.winesPerRow = 4;
  };

  $scope.largeThumbnails = function() {
    $scope.wineCls = 'col-md-4';
    $scope.winesPerRow = 3;
  };

  $scope.add = function() {
    $location.path('/cellar/wines/new');
  };

  $scope.delete = function(wine) {
    wine.$delete(function() {
      refresh();      
    });
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

  $scope.winesPerRow = 3;
  $scope.wineCls = 'col-md-4';
  $scope.refresh();
}])

.controller('EditWineCtrl', ['$scope', '$location', 'wine', 'Grape', function ($scope, $location, wine, Grape) {
  $scope.wine = wine;
  $scope.isNewGrape = false;
  $scope.grapeName = null;
  $scope.grapes = Grape.query();

  $scope.$watch("grapes.length", function(length) {
    angular.forEach($scope.grapes, function(grape) {
      if (wine.grapeId === grape.grapeId) {
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
  }

  function findGrape(grapeName) {
    var rv;
    angular.forEach($scope.grapes, function(grape) {
      if (grape.name === grapeName) {
         rv = grape;
      }
    });
    return rv;    
  }

  function goToWines() {
    $location.path('/cellar/wines');
  }

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
    goToWines();
  };

  $scope.submit = function() {
    if ($scope.isNewGrape) {
      return;
    }
    $scope.wine.$save({}, function() {
      goToWines();    
    });
  };
}])

.controller('ListGrapesCtrl', ['$scope', 'Grape', function($scope, Grape) {
  $scope.grapes = Grape.query();  
}])

;