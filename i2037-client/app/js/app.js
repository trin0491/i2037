(function() {
  'use strict';

  angular.module('i2037', [
      'ngCookies',
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
      $routeProvider.when('/home', {templateUrl: 'partials/home.html', controller: 'HomeCtrl'});
      $routeProvider.otherwise({redirectTo: '/home'});

    $httpProvider.responseInterceptors.push(['$q', 'Session', function($q, Session) {
      return function(promise) {
        return promise.then(function(response) {
          return response;
        }, function(response) {
          if (response && response.status === 403) {         
              Session.onAuthFailure();
          }
          return $q.reject(response);
        });
      };
    }]);       
  }])

  .controller('NavBarCtrl', ['$scope', '$location', '$modal', 'User', 'Session', 
      function($scope, $location, $modal, User, Session) {
    $scope.$location = $location;

    var STATES = {
      LOGGED_OUT: 'LOGGED_OUT',
      LOGGING_IN: 'LOGGING_IN',
      LOGGED_IN: 'LOGGED_IN',
      LOGGING_OUT: 'LOGGING_OUT'
    };

    var Menu = function(name, path) {
      var menu = {
          name: name,
          path: path,
          isActive: false
      };
      return menu;
    };

    var menus = [
      new Menu('Recipes', '/recipes'), 
      new Menu('Cellar', '/cellar'),
      new Menu('Journal', '/journal'),
      new Menu('Cage', '/cage')
    ];
    $scope.menus = menus;

    function onUserUpdate(user) {
      $scope.state = user != null ? STATES.LOGGED_IN : STATES.LOGGED_OUT;
      $scope.user = user;
    }

    function showLoginForm() {
      var opts = {
          keyboard: true,
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

      var oldState = $scope.state;
      $scope.state = STATES.LOGGING_IN; // move to service
      var loginForm = $modal.open(opts);
      loginForm.result.then(function(user){
        onUserUpdate(user);
      }, function(response) {
        $scope.state = oldState;
      });    
    }

    $scope.$on('SessionService::AuthRequired', function(e) {
      $location.path('/home');    
      showLoginForm();
    });

    $scope.login = function() {
      User.get().then(function(user) {
        onUserUpdate(user);
      });    
    };

    $scope.signUp = function() {
      var signUpForm = $modal.open({
        templateUrl: 'partials/signupform.html',
        controller: 'SignUpFormCtrl'
      });
      signUpForm.result.then(function(user) {
        onUserUpdate(user);
      });    
    };

    $scope.logout = function() {
      var oldState = $scope.state;
      $scope.state = STATES.LOGGING_OUT;
      User.logout().then(function(user) {
        onUserUpdate(user);
      }, function() {
        $scope.state = oldState;
        alert("Failed to logout");      
      }); 
    };

    $scope.login();
  }])

  .controller('LoginFormCtrl', ['$scope', '$modalInstance', 'User', 'userName',
      function ($scope, $modalInstance, User, userName) {

    var authDetails = {    
      userName: userName,
      password: '',
      rememberMe: true,    
      userNameReadonly: false,
    };

    if (userName) {
      $scope.title = 'Change Password';
      authDetails.userNameReadonly = true;
    } else {
      $scope.title = 'Login';
      authDetails.userName = $.cookie('userName');
    }

    $scope.cancel = function(){
      $modalInstance.close();
    };

    $scope.submit = function() {
      if (authDetails.rememberMe && authDetails.userName) {
        $.cookie('userName', authDetails.userName, { expires: 7 });
      } else {
        $.cookie.removeCookie('userName');
      }

      User.login(authDetails.userName, authDetails.password).then(function(user) {
        $modalInstance.close(user);
      }, function(data, status) {
        alert("Failed to authenticate");
      });
    };

    $scope.authDetails = authDetails;  
  }])

  .controller('SignUpFormCtrl', ['$scope', '$modalInstance', 'User', function($scope, $modalInstance, User) {
    $scope.user = new User();

    $scope.cancel = function() {
      $modalInstance.close();
    };

    $scope.submit = function() {
      $scope.user.$save().then(function(user) {
        $modalInstance.close(user);
      });
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
    };

    $scope.passwordsMatch = function() {
      return $scope.user.password === $scope.password2;
    };

    $scope.canSubmit = function() {
      return $scope.signUpForm.$dirty &&
        $scope.signUpForm.$valid && $scope.passwordsMatch();
    };
  }])

  .controller('HomeCtrl', [function () {}])
  ;
}());