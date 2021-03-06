///<reference path="../../../../typings/tsd.d.ts" />

import environment from "./environment";

declare var d3:any;

class User {
  static get(params):any {

  }

  constructor(data:any) {
    angular.extend(this, data);
  }
}

export class Session {
}

export class PathFinder {
  private prefix:string;

  constructor(svcPrefix:string) {
    this.prefix = svcPrefix;
    this.prefix += '/';
  }

  get(name:string):string {
    return this.prefix + name;
  }
}

export class D3Service {
  constructor(private d3Base) {
  }

  d3() {
    return this.d3Base;
  }
}

export class GoogleService {
  constructor(private _google) {}

  get google() {
    return this._google;
  }
}

export default angular.module('i2037.services', [environment.name, 'i2037.resources.user'])

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
    var svc:D3Service = new D3Service(d3);
    return svc;
  }])

  .factory('googleService', [function () {
    return new GoogleService(google);
  }])
;
