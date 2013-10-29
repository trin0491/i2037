
angular.module('i2037.resources.foursquare', ['i2037.services'])

.factory('FourSquareVenue', ['$http', 'pathFinder', function($http, pathFinder) {

  var baseUrl = pathFinder.get('svc/foursquare/venue/');

  // constructor
  var Venue = function(data) {
    angular.extend(this, data);
  };

  Venue.get = function(id, params) {
    var url = baseUrl + id;
    return $http.get(url, { params: params }).then(function(rv) {
      var venue = new Venue(rv.data.response.venue);
      return venue;
    })
  };

  return Venue;
}])

;