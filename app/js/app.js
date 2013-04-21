'use strict';

// Declare app level module which depends on filters, and services
angular.module('i2037', ['ui.bootstrap', 'i2037.filters', 'i2037.services', 'i2037.directives']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/home', {templateUrl: 'partials/home.html', controller: HomeCtrl});
    $routeProvider.when('/wineview',  {templateUrl: 'partials/wineview.html',  controller: WineViewCtrl});
    $routeProvider.when('/slickgrid', {templateUrl: 'partials/slickgrid.html', controller: SlickgridCtrl});
    $routeProvider.otherwise({redirectTo: '/home'});
  }]);
