'use strict';

/* Directives */


angular.module('i2037.directives', []).
  directive('i2AppVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }])

;

