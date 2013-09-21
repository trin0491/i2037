'use strict';

/* Services */

angular.module('i2037.services', ['i2037.environment'])

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

