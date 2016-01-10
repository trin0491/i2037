///<reference path="../../../typings/tsd.d.ts" />

import services from "../common/services/services";
import {LoginForm} from "./controllers/LoginForm";

const TEMPLATE = 'js/admin/templates/admin-loginform.tpl.html';
export default angular.module('i2037.admin.loginform', [
    'ngRoute',
    services.name,
    TEMPLATE,
  ])

  .config(['$routeProvider', function ($routeProvider:ng.route.IRouteProvider) {
    $routeProvider.when('/login', {
      templateUrl: TEMPLATE,
      controller: 'LoginFormCtrl',
      controllerAs: 'vm',
      resolve: {
        user: function () {
          return null;
        }
      }
    });
  }])

  .controller('LoginFormCtrl', LoginForm)
;

