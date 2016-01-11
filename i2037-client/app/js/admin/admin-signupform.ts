///<reference path="../../../typings/tsd.d.ts" />

import services from "../common/services/services";
import userResources from "../common/resources/user";
import {SignUpForm} from "./controllers/SignUpForm";

const TEMPLATE = 'js/admin/templates/admin-signupform.tpl.html';

export default angular.module('i2037.admin.signupform', [
    'ngRoute',
    services.name,
    userResources.name,
    TEMPLATE,
  ])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/signup', {
      templateUrl: TEMPLATE,
      controller: 'SignUpForm',
      controllerAs: 'vm',
      resolve: {
        user: ['User', function (User) {
          return new User();
        }]
      }
    });

    $routeProvider.when('/changepassword', {
      templateUrl: TEMPLATE,
      controller: 'SignUpForm',
      controllerAs: 'vm',
      resolve: {
        user: ['Session', function (Session) {
          return Session.getUser();
        }]
      }
    });
  }])

  .controller('SignUpForm', SignUpForm)
;

