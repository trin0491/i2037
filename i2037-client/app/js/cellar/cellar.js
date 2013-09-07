/* Controllers */

angular.module('i2037.cellar', ['i2037.services'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/cellar',  {templateUrl: 'partials/wineview.html',  controller: 'WineViewCtrl'});
}])

.controller('WineViewCtrl', ['$scope', '$dialog', 'Wine', function($scope, $dialog, Wine) {

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
}])

.controller('WineFormCtrl', ['$scope', 'dialog', 'wine', 'Grape', function ($scope, dialog, wine, Grape) {
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
}])

;