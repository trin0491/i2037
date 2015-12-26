/**
 * Created by richard on 24/12/2015.
 */
///<reference path="../../typings/tsd.d.ts" />
requirejs(['./app', './templates/i2037-client.tpl'], function (app) {
  angular.bootstrap(document.documentElement, ['i2037']);
});