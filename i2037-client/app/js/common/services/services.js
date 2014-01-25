(function() {
  'use strict';

  angular.module('i2037.services', ['i2037.environment'])

  .factory('pathFinder', ['version', 'svcPrefix', function(version, svcPrefix) {
    var my = { };
    var prefix = svcPrefix;
    // TODO
    if (prefix) {
      prefix += '/';
    }
    my.get = function(name) {
      return prefix + name;
    };
    return my;  
  }])

  .factory('Session', ['$rootScope', function($rootScope) {
    var my = {};

    my.onAuthFailure = function() {
      $rootScope.$broadcast('SessionService::AuthRequired');
    };

    return my;
  }])

  .factory('d3Service', [function() {
    return d3;
  }])
  ;
}());
