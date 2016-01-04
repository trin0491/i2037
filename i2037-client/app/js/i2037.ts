///<reference path="../../typings/tsd.d.ts" />

import {adminModule, Menu} from "./admin/module";
import recipes from "./recipes/recipes";
import cellar from "./cellar/cellar";
import user from "./common/resources/user";
import services from "./common/services/services";
import environment from "./common/services/environment";
import filters from "./common/filters";
import {journal} from "./journal/module";
import cage from "./cage/cage";
import directives from "./common/directives/directives";
import "./templates/i2037-client.tpl";

export default angular.module('i2037', [
    'ui.bootstrap',
    adminModule.name,
    recipes.name,
    cellar.name,
    journal.name,
    cage.name,
    filters.name,
    environment.name,
    services.name,
    user.name,
    directives.name,
    'i2037.templates'])

  .config(['$routeProvider', '$httpProvider', function ($routeProvider:ng.route.IRouteProvider, $httpProvider) {

    $routeProvider.when('/home', {templateUrl: 'partials/home.html', controller: 'HomeCtrl'});
    $routeProvider.otherwise({redirectTo: '/home'});

    $httpProvider.responseInterceptors.push(['$q', '$location', function ($q, $location) {
      return function (promise) {
        return promise.then(function (response) {
          return response;
        }, function (response) {
          if (response && response.status === 403) {
            $location.path("/login");
          }
          return $q.reject(response);
        });
      };
    }]);
  }])

  .controller('NavBarCtrl', ['$scope', '$location', 'Session',
    function ($scope, $location:ng.ILocationService, Session) {
      $scope.$location = $location;

      var menus:Menu[] = [
        new Menu('Recipes', '/recipes'),
        new Menu('Cellar', '/cellar'),
        new Menu('Journal', '/journal'),
        new Menu('Cage', '/cage'),
      ];
      $scope.menus = menus;

      $scope.$on('SessionService::StateChange', function (event, state) {
        $scope.state = state;
        if ($scope.state === 'LOGGED_IN') {
          $scope.user = Session.getUser();
        } else {
          $scope.user = null;
        }
      });

      $scope.login = function () {
        $location.path("/login");
      };

      $scope.signUp = function () {
        $location.path('/signup');
      };

      $scope.logout = function () {
        Session.logout();
      };

      $scope.changePassword = function () {
        $location.path('/changepassword');
      };

      $scope.user = Session.getUser();
    }])

  .controller('HomeCtrl', [function () {
  }])

  .controller('ViewPortCtrl', ['$scope', function ($scope) {
    $scope.alerts = [];

    $scope.$on('$routeChangeStart', function () {
      $scope.showViewSpinner = true;
    });

    $scope.$on('$routeChangeSuccess', function () {
      $scope.showViewSpinner = false;
    });

    $scope.$on('$routeChangeError', function () {
      $scope.showViewSpinner = false;
    });

    $scope.$on('Resource::Loading', function (event, name) {
      $scope.showViewSpinner = true;
    });

    $scope.$on('Resource::Loaded', function (event, name) {
      $scope.showViewSpinner = false;
    });

    $scope.$on('Resource::LoadingError', function (event, name, msg) {
      showError(msg);
    });

    $scope.$on('Resource::SaveError', function (event, name, msg) {
      showError(msg);
    });

    $scope.$on('Resource::DeleteError', function (event, name, msg) {
      showError(msg);
    });

    function showError(msg) {
      $scope.showViewSpinner = false;
      $scope.alerts.push({type: 'danger', msg: msg});
    }

    $scope.closeAlert = function (index) {
      $scope.alerts.splice(index, 1);
    };

  }])
;

angular.bootstrap(document.documentElement, ['i2037']);