angular.module('i2037.resources.cellar', ['i2037.services', 'ngResource'])

.factory('Wine', function($resource, pathFinder) {
  return $resource(pathFinder.get('svc/wines/:wineId'), 
    { wineId: '@wineId' }, 
    { query: {method:'GET', params:{}, isArray:true } }
  )
})  

.factory('Grape', function($resource, pathFinder) {
    return $resource(pathFinder.get('svc/grapes'), {}, {
      query: {method:'GET', params:{}, isArray:true}
    })
})
;