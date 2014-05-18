(function() {
  'use strict';

  angular.module('i2037.services', ['i2037.environment', 'i2037.resources.user'])

  .factory('pathFinder', ['version', 'svcPrefix', function(version, svcPrefix) {
    var my = { };
    var prefix = svcPrefix;
    // TODO
    if (prefix) {
      prefix += '/';
    }
    my.get = function(name) {
      return prefix + name;
    };
    return my;  
  }])

  .factory('Session', ['$rootScope', '$location', '$q', 'User', function($rootScope, $location, $q, User) {
    var STATES = {
      LOGGED_OUT: 'LOGGED_OUT',
      LOGGED_IN: 'LOGGED_IN',
    };

    var _user = null;
    var _state = STATES.LOGGED_OUT;

    function raiseStateChange(state) {
      _state = state;
      $rootScope.$broadcast('SessionService::StateChange', state);
    }

    var service = {
      getUser: function() {
        if (_user) {
          return $q.when(_user);
        } else {
          return User.get().then(function(user) {
            _user = user;
            raiseStateChange(STATES.LOGGED_IN);
            return user;
          });             
        }
      },

      getState: function() {
        return _state;
      }, 

      login: function(userName, password) {
        return User.login(userName, password).then(function(user) {
          _user = user;
          raiseStateChange(STATES.LOGGED_IN);
          return user;
        });   
      },

      logout: function() {
        return User.logout().then(function(user) {
          _user = null;
          raiseStateChange(STATES.LOGGED_OUT);
        }); 
      },

      signup: function(newUser) {
        return newUser.$save().then(function(user) {
          _user = user;
          raiseStateChange(STATES.LOGGED_IN);
          return user;
        });
      }
    };
    return service;
  }])

  .factory('d3Service', [function() {
    var me = {d3: function() { return d3; }};
    return me;
  }])
  ;
}());
