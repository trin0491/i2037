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
  refresh();
}
WineViewCtrl.$inject = ['$scope', '$dialog', 'Wine'];

function WineFormCtrl($scope, dialog, wine, Grape) {
  $scope.wine = wine;
  $scope.isNewGrape = false;

  $scope.$watch("grapes.length", function(length) {
    angular.forEach($scope.grapes, function(grape) {
      if (wine.grapeId == grape.grapeId) {
        $scope.grapeName = grape.name;
      }
    });
  });
  $scope.grapes = Grape.query();

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
WineFormCtrl.$inject = ['$scope', 'dialog', 'wine', 'Grape'];

function NavBarCtrl($scope, $location, $dialog, $http, User) {
  $scope.user = null;
  $scope.$location = $location;

  function setMenuVisibility(user) {
    var isLoggedIn = user != null;
    $scope.showCellar = isLoggedIn;
    $scope.showCage = isLoggedIn;
  }

  $scope.$watch("user", setMenuVisibility);

  $scope.login = function() {
    var opts = {
        backdrop: true,
        keyboard: true,
        dialogFade: true,
        backdropClick: true,
        templateUrl: 'partials/loginform.html', 
        controller: 'LoginFormCtrl',
        resolve: {
          user: function() {
            if ($scope.user) {
              return angular.copy($scope.user)  
            } else {
              return  null;
            }              
          }
        }
    };

    var loginForm = $dialog.dialog(opts);
    loginForm.open().then(function(credentials){
      if(credentials)
      {        
        var user = jQuery.param({
          j_username: credentials.userName,
          j_password: credentials.password
        });
        $http.post('/cellar-webapp/j_spring_security_check', user, { 
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).success(function(data, status) {
          $scope.user = data;
        }).error(function(data, status) {
          alert("Failed to authenticate");
        });
      }
    });
  };

  $scope.logout = function() {
    $http.get('/cellar-webapp/j_spring_security_logout')
    .success(function(data, status) {
      $scope.user = null;
    }).error(function(data, status) {
      alert("Failed to logout");
    }); 
  };

  $scope.getAccountLabel = function() {
    if ($scope.user) {
      return $scope.user.userName;      
    } else {
      return 'My Account';      
    }
  };

//  $scope.user = User.get();
}
NavBarCtrl.$inject = ['$scope', '$location', '$dialog', '$http', 'User'];

function LoginFormCtrl($scope, dialog, user) {
  if (user) {
    $scope.title = 'Change Password'
    $scope.userName = user.userName;
    $scope.userNameReadonly = true;
  } else {
    $scope.title = 'Login'
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
LoginFormCtrl.$inject = ['$scope', 'dialog', 'user'];

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