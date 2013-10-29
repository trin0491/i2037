
angular.module('i2037.resources.foursquare', ['i2037.services'])

.factory('FourSquareVenue', ['$http', 'pathFinder', function($http, pathFinder) {

  var url = pathFinder.get('svc/foursquare/venue/anId');

  // constructor
  var Venue = function(data) {
    angular.extend(this, data);
  };

  Venue.get = function(params) {
    return $http.get(url, { params: params }).then(function(rv) {
      var venue = new Venue(rv.data.response.venue);
      return venue;
    })
  };

  return Venue;
}])

;