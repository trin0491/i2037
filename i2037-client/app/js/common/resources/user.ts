///<reference path="../../../../typings/tsd.d.ts" />

import services, {PathFinder} from "../services/services";

  class User {
    static get(params):any {

    }

    constructor(data:any) {
      angular.extend(this, data);
    }
  }

  export default angular.module('i2037.resources.user', [services.name])

    .factory('User', ['$http', 'pathFinder', function ($http:ng.IHttpService, pathFinder:PathFinder) {

      var url:string = pathFinder.get('svc/user');

      function getId(user) {
        return user.id;
      }

      var User:any = function (data) {
        angular.extend(this, data);
      };

      User.get = function (params) {
        return $http.get(url).then(function (response) {
          return new User(response.data);
        });
      };

      User.save = function (data) {
        return $http.post(url, data).then(function (response) {
          return new User(data);
        });
      };

      User.update = function (data) {
        return $http.post(url + '/' + data.$id(), data).then(function (response) {
          return data;
        });
      };

      User.prototype.$id = function () {
        return getId(this);
      };

      User.prototype.$save = function () {
        return User.save(this);
      };

      User.prototype.$update = function () {
        return User.update(this);
      };

      User.login = function (userName, password) {
        var loginParams = jQuery.param({
          j_username: userName,
          j_password: password
        });
        return $http.post(pathFinder.get('j_spring_security_check'), loginParams, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then(function (response) {
          return new User(response.data);
        });
      };

      User.logout = function () {
        return $http.get(pathFinder.get('j_spring_security_logout')).then(function () {
          return null;
        });
      };

      return User;
    }])
  ;