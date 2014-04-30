
angular.module('i2037.resources.journal', ['i2037.services'])

.factory('Journal', function() {
    var me = {};

    function pad(n){return n<10 ? '0'+n : n;}

    me.toDateString = function(dt) {
      var y = dt.getFullYear().toString();
      var m = pad(dt.getMonth() + 1).toString();
      var d = pad(dt.getDate()).toString();
      return y + m + d;
    };

    me.toDate = function(str) {
      var r = /(\d{4})(\d{2})(\d{2})/;
      var matches = r.exec(str);
      var d = new Date();
      d.setUTCFullYear(+matches[1]);
      var month = +matches[2]-1; // Careful, month starts at 0!
      var day = +matches[3];      
      d.setUTCMonth(month, day); 
      d.setUTCHours(0);
      d.setUTCMinutes(0);
      d.setUTCSeconds(0);
      return d;
    };

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
    });
  };

  return Profile;
}])

.factory('JournalSummary', ['$http', 'pathFinder', function($http, pathFinder) {

  var url = pathFinder.get('svc/timeline/summary/daily');

  var DaySummary = function(data) {
    angular.extend(this, data);
  };

  DaySummary.get = function(params) {
    return $http.get(url, {params: params}).then(function(response) {
      var days = [];
      angular.forEach(response.data, function(day) {
        days.push(new DaySummary(day));
      });
      return days;
    });
  };

  return DaySummary;
}])

.factory('MovesPlaces', ['$http', 'pathFinder', 'Journal', function($http, pathFinder, Journal) {

  var url = pathFinder.get('svc/moves/user/places/daily/');

  var Places = function(data) {
    angular.extend(this, data);
  };

  Places.get = function(params) {
    var dateStr = Journal.toDateString(params['date']);
    return $http.get(url+dateStr).then(function(response) {
      var places = new Places(response.data);
      return places;
    });    
  };

  return Places;
}])

.factory('JournalStoryline', ['$http', 'pathFinder', 'Journal', function($http, pathFinder, Journal) {

  var url = pathFinder.get('svc/timeline/daily/');

  var Storyline = function(data) {
    angular.extend(this, data);
  };

  Storyline.query = function(params) {
    var dateStr = Journal.toDateString(params['date']);
    return $http.get(url+dateStr).then(function(response) {
      var storylines = [];
      angular.forEach(response.data, function(day) {
        storylines.push(new Storyline(day));      
      });
      return storylines;
    });
  };
  
  return Storyline;
}]);