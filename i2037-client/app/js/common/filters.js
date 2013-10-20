'use strict';

/* Filters */

angular.module('i2037.filters', [])
.filter('interpolate', ['version', function(version) {
    return function(text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    }
 }])

.filter('dateSequence', ['dateFilter', function(dateFilter) {
  return function(input, dateFormat, timeFormat) {
    if (!angular.isArray(input)) {
      return input;
    }

    var last;
    var copy = new Array(input.length);
    for (var i=0;i<input.length;++i) {
      var fmt;
      if (last) {
        fmt = dateFilter(input[i], timeFormat);
      } else {
        fmt = dateFilter(input[i], dateFormat);
      }
      copy[i] = fmt;
      last = input[i];
    }
    return copy;     
  }
}])

;
