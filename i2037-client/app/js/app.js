(function() {
  'use strict';

  angular.module('i2037', [
      'ui.bootstrap',
      'i2037.admin',
      'i2037.recipes',
      'i2037.cellar', 
      'i2037.journal',
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
          templateUrl: 'admin/admin-loginform.tpl.html', 
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
        templateUrl: 'admin/admin-signupform.tpl.html',
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

  .controller('HomeCtrl', [function () {}])

  .controller('ViewPortCtrl', ['$scope', function($scope) {
    $scope.alerts = [];

    $scope.$on('$routeChangeStart', function() {
      $scope.showViewSpinner = true;
    });

    $scope.$on('$routeChangeSuccess', function() {
      $scope.showViewSpinner = false;
    });

    $scope.$on('$routeChangeError', function() {
      $scope.showViewSpinner = false;
    });

    $scope.$on('Resource::Loading', function(event, name) {
      $scope.showViewSpinner = true;
    });

    $scope.$on('Resource::Loaded', function(event, name) {
      $scope.showViewSpinner = false;
    });

    $scope.$on('Resource::LoadingError', function(event, name, msg) {
      showError(msg);
    });

    $scope.$on('Resource::SaveError', function(event, name, msg) {
      showError(msg);
    });

    $scope.$on('Resource::DeleteError', function(event, name, msg) {
      showError(msg);
    });

    function showError(msg) {
      $scope.showViewSpinner = false;
      $scope.alerts.push({type: 'danger', msg: msg});            
    }

    $scope.closeAlert = function(index) {
      $scope.alerts.splice(index, 1);
    };  

  }])
  ;
}());