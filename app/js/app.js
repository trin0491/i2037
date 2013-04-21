'use strict';

// Declare app level module which depends on filters, and services
angular.module('myApp', ['ui.bootstrap', 'myApp.filters', 'myApp.services', 'myApp.directives']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/home', {templateUrl: 'partials/home.html', controller: HomeCtrl});
    $routeProvider.when('/wineview',  {templateUrl: 'partials/wineview.html',  controller: WineViewCtrl});
    $routeProvider.when('/slickgrid', {templateUrl: 'partials/slickgrid.html', controller: SlickgridCtrl});
    $routeProvider.otherwise({redirectTo: '/home'});
  }]);
