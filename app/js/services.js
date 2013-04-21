'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
//angular.module('myApp.services', []).
//  value('version', '0.1');

angular.module('myApp.services', ['ngResource'])
  .value('version', '0.1')
  .factory('wineService', function($resource){
    return $resource('/cellar-webapp/wines', {}, {
      query: {method:'GET', params:{}, isArray:true}
  });
});
