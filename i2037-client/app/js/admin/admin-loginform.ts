///<reference path="../../../typings/tsd.d.ts" />

import services from "../common/services/services";
import {LoginFromCtrl} from "./controllers/LoginFromCtrl";

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
      resolve: {
        user: function () {
          return null;
        }
      }
    });
  }])

  .controller('LoginFormCtrl', LoginFromCtrl)
;

