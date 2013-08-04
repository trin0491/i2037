'use strict';

// Declare app level module which depends on filters, and services
var i2037 = angular.module('i2037', ['ui.bootstrap', 'i2037.filters', 'i2037.environment', 'i2037.services', 'i2037.directives']);

i2037.config(function($routeProvider, $httpProvider) {
    $routeProvider.when('/home',      {templateUrl: 'partials/home.html', controller: HomeCtrl});
    $routeProvider.when('/recipes',   {templateUrl: 'partials/recipes.html', controller: RecipesCtrl});
    $routeProvider.when('/scallops',   {templateUrl: 'partials/recipes.html', controller: RecipesCtrl});
    $routeProvider.when('/wineview',  {templateUrl: 'partials/wineview.html',  controller: WineViewCtrl});
    $routeProvider.when('/cage', {templateUrl: 'partials/slickgrid.html', controller: SlickgridCtrl});
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
});
