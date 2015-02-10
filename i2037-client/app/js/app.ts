///<reference path="admin/admin.ts" />
///<reference path="recipes/recipes.ts" />
///<reference path="cellar/cellar.ts" />
///<reference path="/Users/richard/src/i2037/i2037-client/typings/angularjs/angular.d.ts" />
///<reference path="/Users/richard/src/i2037/i2037-client/typings/jquery.cookie/jquery.cookie.d.ts" />

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

    $httpProvider.responseInterceptors.push(['$q', '$location', function($q, $location) {
      return function(promise) {
        return promise.then(function(response) {
          return response;
        }, function(response) {
          if (response && response.status === 403) {         
              $location.path("/login");
          }
          return $q.reject(response);
        });
      };
    }]);       
  }])

  .controller('NavBarCtrl', ['$scope', '$location', 'Session', 
      function($scope, $location, Session) {
    $scope.$location = $location;
        
    var menus = [
      new Menu('Recipes', '/recipes'), 
      new Menu('Cellar', '/cellar'),
      new Menu('Journal', '/journal'),
      new Menu('Cage', '/cage')
    ];
    $scope.menus = menus;

    $scope.$on('SessionService::StateChange', function(event, state) {
      $scope.state = state;
      if ($scope.state === 'LOGGED_IN') {
        $scope.user = Session.getUser();
      } else {
        $scope.user = null;
      }
    });

    $scope.login = function() {
      $location.path("/login");          
    };

    $scope.signUp = function() {
      $location.path('/signup');
    };

    $scope.logout = function() {
      Session.logout();
    };

    $scope.changePassword = function() {
      $location.path('/changepassword');
    };

    $scope.user = Session.getUser();
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