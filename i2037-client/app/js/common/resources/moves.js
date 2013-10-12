
angular.module('i2037.resources.moves', ['i2037.services', 'i2037.moves.filters'])

.factory('Moves', function() {
    var me = {};

    function pad(n){return n<10 ? '0'+n : n};

    me.toDateString = function(dt) {
      var y = dt.getFullYear().toString();
      var m = pad(dt.getMonth() + 1).toString();
      var d = pad(dt.getDate()).toString();
      return y + m + d;
    }

    me.fromDateString = function(str) {
      var r = /(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z/;
      var matches = r.exec(str);
      var d = new Date();
      d.setUTCFullYear(+matches[1]);
      d.setUTCMonth(+matches[2]-1); // Careful, month starts at 0!
      d.setUTCDate(+matches[3]);
      d.setUTCHours(+matches[4]);
      d.setUTCMinutes(+matches[5]);
      d.setUTCSeconds(+matches[6]);
      return d;
    }

    return me;
})

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

.factory('MovesSummary', ['$http', 'pathFinder', function($http, pathFinder) {

  var url = pathFinder.get('svc/moves/user/summary/daily/');

  var Summary = function(data) {
    angular.extend(this, data);
  };

  Summary.get = function(params) {
    return $http.get(url+params['date']).then(function(response) {
      var summary = new Summary(response.data[0]);
      return summary;
    });
  };

  return Summary;
}])

.factory('MovesPlaces', function($resource, pathFinder) {
    return $resource(pathFinder.get('svc/moves/user/places/daily/:date'));
})

.factory('MovesStoryline', function($resource, pathFinder) {
    return $resource(pathFinder.get('svc/moves/user/storyline/daily/:date'));
});