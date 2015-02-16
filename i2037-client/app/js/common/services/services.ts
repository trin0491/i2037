module services {
  class Session {
  }

  class PathFinder {
    private prefix:string;

    constructor(svcPrefix:string) {
      this.prefix = svcPrefix;
      if (this.prefix) {
        this.prefix += '/';
      }
    }

    get(name:string):String {
      return this.prefix + name;
    }
  }

  (function () {
    'use strict';

    angular.module('i2037.services', ['i2037.environment', 'i2037.resources.user'])

      .factory('pathFinder', ['version', 'svcPrefix', function (version, svcPrefix) {
        var pathFinder:PathFinder = new PathFinder(svcPrefix);
        return pathFinder;
      }])

      .factory('Session', ['$rootScope', '$location', '$q', 'User', function ($rootScope:ng.IRootScopeService, $location, $q, User) {
        var STATES = {
          LOGGED_OUT: 'LOGGED_OUT',
          LOGGED_IN: 'LOGGED_IN'
        };

        var _user = null;
        var _state = STATES.LOGGED_OUT;

        function raiseStateChange(state) {
          _state = state;
          $rootScope.$broadcast('SessionService::StateChange', state);
        }

        var service = {
          getUser: function () {
            if (_user) {
              return _user;
            } else {
              return User.get().then(function (user) {
                _user = user;
                raiseStateChange(STATES.LOGGED_IN);
                return user;
              });
            }
          },

          getState: function () {
            return _state;
          },

          login: function (userName, password) {
            return User.login(userName, password).then(function (user) {
              _user = user;
              raiseStateChange(STATES.LOGGED_IN);
              return user;
            });
          },

          logout: function () {
            return User.logout().then(function (user) {
              _user = null;
              raiseStateChange(STATES.LOGGED_OUT);
            });
          },

          signup: function (newUser) {
            return newUser.$save().then(function (user) {
              _user = user;
              raiseStateChange(STATES.LOGGED_IN);
              return user;
            });
          }
        };
        return service;
      }])

      .factory('d3Service', [function () {
        var me = {
          d3: function():D3.Base {
            return d3;
          }
        };
        return me;
      }])
    ;
  }());
}