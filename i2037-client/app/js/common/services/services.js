'use strict';

/* Services */

angular.module('i2037.services', ['ngResource', 'i2037.environment'])

.factory('pathFinder', function(version, svcPrefix) {
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
})

.factory('User', function($resource, $http, pathFinder) {
  var user = $resource(pathFinder.get('svc/session/user'));

  user.login = function(userName, password) {
      var loginParams = jQuery.param({
        j_username: userName,
        j_password: password
      });   
      return $http.post(pathFinder.get('j_spring_security_check'), loginParams, { 
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
  };

  user.logout = function() {
      return $http.get(pathFinder.get('j_spring_security_logout'));
  };

  return user;
})

.factory('Session', function() {
  var my = {};

  var handlers = [];

  my.on = function(name, callback) {
    handlers.push(callback);
  };

  my.raiseAuthFailure = function() {
    for (var i = 0; i < handlers.length; i++) {
      handlers[i]();
    };
  };

  return my;
})

;

