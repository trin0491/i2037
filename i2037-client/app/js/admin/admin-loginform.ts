///<reference path="../../../typings/tsd.d.ts" />

import {upgradeAdapter} from "../common/upgradeAdapter";
import services from "../common/services/services";
import {LoginForm} from "./controllers/LoginForm";

export default angular.module('i2037.admin.loginform', [
    'ngRoute',
    services.name,
  ])

  .config(['$routeProvider', function ($routeProvider:ng.route.IRouteProvider) {
    $routeProvider.when('/login', {
      template: '<i2-login-form></i2-login-form>',
    });
  }])

  .directive('i2LoginForm',
    <angular.IDirectiveFactory>upgradeAdapter.downgradeNg2Component(LoginForm));
;

