'use strict';

angular.module('i2037', [
    'ui.bootstrap', 
    'i2037.recipes',
    'i2037.cellar', 
    'i2037.moves', 
    'i2037.cage', 
    'i2037.filters', 
    'i2037.environment', 
    'i2037.services', 
    'i2037.directives'])

.config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
    $routeProvider.when('/home',      {templateUrl: 'partials/home.html', controller: 'HomeCtrl'});
    $routeProvider.otherwise({redirectTo: '/home'});

  $httpProvider.responseInterceptors.push(function($q, Session) {
    return function(promise) {
        return promise.then(function(response) {
          return response;
        }, function(response) {
        if (response && response.status == 403) {         
            Session.raiseAuthFailure();
        }
        return $q.reject(response);
        });
    }
  });       
}])

.controller('NavBarCtrl', ['$scope', '$location', '$dialog', 'User', 'Session', 
    function($scope, $location, $dialog, User, Session) {
  $scope.$location = $location;

  function setMenuVisibility(user) {
    var isLoggedIn = user != null;
    $scope.showCellar = isLoggedIn;
    $scope.showCage = isLoggedIn;
    $scope.showLogin = !isLoggedIn;
    $scope.showLogout = isLoggedIn;
    $scope.showMoves = isLoggedIn;
  };

  function setAccountLabel(user) {
    if (user && user.userName) {
      $scope.accountMenuLabel = user.userName;      
    } else {
      $scope.accountMenuLabel = 'My Account';      
    }
  };

  function onUserUpdate(user) {
      $scope.user = user;
      setMenuVisibility(user);
      setAccountLabel(user);    
  }

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
        onUserUpdate(user);
    });
  };

  $scope.logout = function() {
    User.logout().then(function(user) {
        onUserUpdate(user)
    }, function() {
      alert("Failed to logout");
    }); 
  };

  User.get().then(function(user) {
    onUserUpdate(user);
  });
}])

.controller('LoginFormCtrl', ['$scope', 'dialog', 'User', 'userName',
    function ($scope, dialog, User, userName) {
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

    User.login($scope.userName, $scope.password).then(function(user) {
      dialog.close(user);
    }, function(data, status) {
      alert("Failed to authenticate");
    });
  }
}])

.controller('HomeCtrl', [function () {}])
;