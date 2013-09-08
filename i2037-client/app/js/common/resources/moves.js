
angular.module('i2037.resources.moves', ['i2037.services'])

.factory('MovesProfile', ['$http', 'pathFinder', function($http, pathFinder) {

  var url = pathFinder.get('svc/moves/user/profile');

  // constructor
  var Profile = function(data) {
    angular.extend(this, data);
  };

  Profile.get = function(params) {
    return $http.get(url, { params: params }).then(function(response) {
      var profile = new Profile(response.data);
      return profile;
    })
  };

  return Profile;
}])

.factory('MovesSummary', function($resource, pathFinder) {
    return $resource(pathFinder.get('svc/moves/user/summary/daily/:date'));
})

.factory('MovesPlaces', function($resource, pathFinder) {
    return $resource(pathFinder.get('svc/moves/user/places/daily/:date'));
})

.factory('MovesStoryline', function($resource, pathFinder) {
    return $resource(pathFinder.get('svc/moves/user/storyline/daily/:date'));
});