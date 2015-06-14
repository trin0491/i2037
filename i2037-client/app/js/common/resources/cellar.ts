///<reference path="../../../../typings/tsd.d.ts" />
///<reference path="../services/services.ts" />

module i2037.resources {

  import PathFinder = i2037.services.PathFinder;

  angular.module('i2037.resources.cellar', ['i2037.services', 'ngResource'])

    .factory('Wine', ['$resource', 'pathFinder', function($resource, pathFinder:PathFinder) {
    return $resource(pathFinder.get('svc/wines/:wineId'),
      { wineId: '@wineId' },
      { query: { method: 'GET', params: {}, isArray: true } }
      );
  }])

    .factory('Grape', ['$resource', 'pathFinder', function($resource, pathFinder:PathFinder) {
    return $resource(pathFinder.get('svc/grapes'), {}, {
      query: { method: 'GET', params: {}, isArray: true }
    });
  }])
  ;

}