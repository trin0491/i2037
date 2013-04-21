'use strict';

/* Controllers */
function WineViewCtrl($scope, $dialog, wineService) {
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

  $scope.add = function() {
    var opts = {
        backdrop: true,
        keyboard: true,
        dialogFade: true,
        backdropClick: true,
        templateUrl: 'partials/wineform.html', 
        controller: 'WineFormCtrl',
        resolve: {
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

function WineFormCtrl($scope) {

};
WineFormCtrl.$inject = ['$scope'];

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
  var me = this;

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

function RecipiesCtrl($scope) {
};
RecipiesCtrl.$inject = ['$scope'];