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
    'i2037.resources.user', 
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

  var STATES = {
    LOGGED_OUT: 'LOGGED_OUT',
    LOGGING_IN: 'LOGGING_IN',
    LOGGED_IN: 'LOGGED_IN',
    LOGGING_OUT: 'LOGGING_OUT'
  }

  var Menu = function(name, path) {
    var menu = {
        name: name,
        path: path,
        isActive: false
    };
    return menu;
  }

  var menus = [
    new Menu('Recipes', '/recipes'), 
    new Menu('Cellar', '/cellar'),
    new Menu('Moves', '/moves'),
    new Menu('Cage', '/cage')
  ];
  $scope.menus = menus;

  function onUserUpdate(user) {
    $scope.state = user != null ? STATES.LOGGED_IN : STATES.LOGGED_OUT;
    $scope.user = user;
  }

  function login() {
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
    var oldState = $scope.state;
    $scope.state = STATES.LOGGING_IN; // move to service
    loginForm.open().then(function(user){
      onUserUpdate(user);
    }, function(response) {
      $scope.state = oldState;
    });    
  }

  Session.on('authFailure', function() {
    $location.path('/home');    
    login();
  });

  $scope.login = function() {
    User.get().then(function(user) {
      onUserUpdate(user);
    });    
  };

  $scope.signUp = function() {
    var signUpForm = $dialog.dialog({
      templateUrl: 'partials/signupform.html',
      controller: 'SignUpFormCtrl'
    });
    signUpForm.open().then(function(user) {
      onUserUpdate(user);
    });    
  };

  $scope.logout = function() {
    var oldState = $scope.state;
    $scope.state = STATES.LOGGING_OUT;
    User.logout().then(function(user) {
        onUserUpdate(user)
    }, function() {
      $scope.state = oldState;
      alert("Failed to logout");      
    }); 
  };

  onUserUpdate(null);
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
      $.cookie.removeCookie('userName');
    }

    User.login($scope.userName, $scope.password).then(function(user) {
      dialog.close(user);
    }, function(data, status) {
      alert("Failed to authenticate");
    });
  }
}])

.controller('SignUpFormCtrl', ['$scope', 'dialog', 'User', function($scope, dialog, User) {
  $scope.user = new User();

  $scope.cancel = function() {
    dialog.close();
  };

  $scope.submit = function() {
    $scope.user.$save().then(function(user) {
      dialog.close(user);
    })
  };

  $scope.getCls = function(ngModelController) {
    if (!ngModelController) {
      return {};
    } else {
      return {
        error: ngModelController.$invalid && ngModelController.$dirty,
        success: ngModelController.$valid && ngModelController.$dirty
      };      
    }
  };

  $scope.showErr = function(ngModelController, validation) {
    if (ngModelController) {
      return ngModelController.$dirty && ngModelController.$error[validation];
    } else {
      return false;
    }
  }

  $scope.passwordsMatch = function() {
    return $scope.user.password === $scope.password2;
  }

  $scope.canSubmit = function() {
    return $scope.signUpForm.$dirty &&
      $scope.signUpForm.$valid && $scope.passwordsMatch();
  }
}])

.controller('HomeCtrl', [function () {}])
;