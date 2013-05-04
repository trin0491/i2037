'use strict';

/* Controllers */
function WineViewCtrl($scope, $dialog, wineService) {

  function newWineForm(wine) {
    var opts = {
        backdrop: true,
        keyboard: true,
        dialogFade: true,
        backdropClick: true,
        templateUrl: 'partials/wineform.html', 
        controller: 'WineFormCtrl',
    };

    if (wine) {
      opts.resolve = { 
        wine: function() { 
          return angular.copy(wine);
        },
        mode: function() { return 'Edit' }
      }
    } else {
      opts.resolve = {
        wine: function() { return { rating: 0 } },
        mode: function() { return 'New' }
      }
    }

    var d = $dialog.dialog(opts);
    return d;
  };

  $scope.winesPerRow = 4;
  $scope.wines = wineService.query();
  $scope.wineCls = 'span3';

  $scope.smallThumbnails = function() {
    $scope.wineCls = 'span3';
    $scope.winesPerRow = 4;
  };

  $scope.largeThumbnails = function() {
    $scope.wineCls = 'span4';
    $scope.winesPerRow = 3;
  };

  $scope.edit = function(wine) {
    var f = newWineForm(wine);
    f.open().then(function(wine){
      if(wine)
      {
        alert('dialog closed with wine: ' + wine);
      }
    });
  };

  $scope.add = function() {
    var d = newWineForm();
    d.open().then(function(wine){
      if(wine)
      {
        alert('dialog closed with wine: ' + wine);
      }
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

  $scope.noRows = function() {
    return noRows($scope.wines, $scope.winesPerRow);
  };

  $scope.$watch('wines', function(newWines) {
    layoutGrid(newWines, $scope.winesPerRow);
  }, true);

  $scope.$watch('winesPerRow', function(newWinesPerRow) {
    layoutGrid($scope.wines, newWinesPerRow);
  }, true);
}
WineViewCtrl.$inject = ['$scope', '$dialog', 'wineService'];

function WineFormCtrl($scope, dialog, wine, mode, grapeService) {
  $scope.wine = wine;
  $scope.mode = mode;
  $scope.isNewGrape = false;

  $scope.$watch("grapes.length", function(length) {
    angular.forEach($scope.grapes, function(grape) {
      if (wine.grapeId == grape.grapeId) {
        $scope.grapeName = grape.name;
      }
    });
  });
  $scope.grapes = grapeService.query();

  function findGrape(grapeName) {
    var rv;
    angular.forEach($scope.grapes, function(grape) {
      if (grape.name == grapeName) {
         rv = grape;
      }
    });
    return rv;    
  };

  $scope.$watch('grapeName', function(newGrapeName, oldGrapeName) {
    if (newGrapeName) {
      var grape = findGrape(newGrapeName);
      if (grape) {
        wine.grapeId = grape.grapeId;
      } else {
        wine.grapeId = undefined;
      }      
    }
  });

  $scope.onGrapeChange = function() {
    $scope.isNewGrape = angular.isUndefined(findGrape($scope.grapeName));
  };

  $scope.cancel = function() {
    dialog.close();
  };

  $scope.submit = function() {
    dialog.close($scope.wine);
  }
};
WineFormCtrl.$inject = ['$scope', 'dialog', 'wine', 'mode', 'grapeService'];

function NavBarCtrl($scope, $location, $dialog) {
  $scope.userName = 'Richard Priestley';
  $scope.$location = $location;

  $scope.showForm = function() {
    var opts = {
        backdrop: true,
        keyboard: true,
        dialogFade: true,
        backdropClick: true,
        templateUrl: 'partials/loginform.html', 
        controller: 'LoginFormCtrl',
        resolve: {
          userName: function() { return angular.copy($scope.userName) }
        }
    };

    var d = $dialog.dialog(opts);
    d.open().then(function(credentials){
      if(credentials)
      {
        alert('dialog closed with credentials: ' + credentials);
      }
    });
  };
}
NavBarCtrl.$inject = ['$scope', '$location', '$dialog'];

function LoginFormCtrl($scope, dialog, userName) {
  if (userName) {
    $scope.title = 'Change Password'
    $scope.userName = userName;
    $scope.userNameReadonly = true;
  } else {
    $scope.title = 'Login'
    $scope.userName = 'Username';
  }

  $scope.cancel = function(){
    dialog.close();
  };

  $scope.submit = function() {
    dialog.close({
      userName: $scope.userName, 
      password: $scope.password
    });
  }
}
LoginFormCtrl.$inject = ['$scope', 'dialog', 'userName'];

function HomeCtrl() {}
HomeCtrl.$inject = [];

function SlickgridCtrl($scope) {
  var grid;
  var columns = [
    {id: "title", name: "Title", field: "title"},
    {id: "duration", name: "Duration", field: "duration"},
    {id: "%", name: "% Complete", field: "percentComplete"},
    {id: "start", name: "Start", field: "start"},
    {id: "finish", name: "Finish", field: "finish"},
    {id: "effort-driven", name: "Effort Driven", field: "effortDriven"}
  ];

  var options = {
    enableCellNavigation: true,
    enableColumnReorder: false
  };

  var data = [];
  for (var i = 0; i < 500; i++) {
    data[i] = {
      title: "Task " + i,
      duration: "5 days",
      percentComplete: Math.round(Math.random() * 100),
      start: "01/01/2009",
      finish: "01/05/2009",
      effortDriven: (i % 5 == 0)
    };
  };
  var grid = new Slick.Grid('#myGrid', data, columns, options);
}
SlickgridCtrl.$inject = ['$scope'];

function RecipesCtrl($scope) {
};
RecipesCtrl.$inject = ['$scope'];