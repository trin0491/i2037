///<reference path="../../typings/tsd.d.ts" />

// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js

import JournalModule from 'journal/journal';

export default class AppModule {
  public static NAME:string = 'i2037-mobile';

  private static _instance:AppModule = new AppModule();

  public get instance():AppModule {
    return AppModule._instance;
  }

  constructor() {
    var m = angular.module(AppModule.NAME, [
      'ionic',
      JournalModule.NAME
    ])
    m.run(function ($ionicPlatform) {
      $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
          // org.apache.cordova.statusbar required
          window.StatusBar.styleDefault();
        }
      });
    });

    m.config(function ($stateProvider, $urlRouterProvider) {
      $stateProvider
        .state('app', {
          url: "/app",
          abstract: true,
          templateUrl: "templates/menu.html",
          controller: 'MenuCtrl'
        })
        .state('app.journal', {
          url: "/journal",
          views: {
            'menuContent': {
              templateUrl: "templates/journal.html"
            }
          }
        })
        .state('app.test', {
          url: "/test",
          templateUrl: "templates/test.html",
          controller: 'test'
        })

      // if none of the above states are matched, use this as the fallback
      $urlRouterProvider.otherwise('/app/journal');
    });

    m.controller('MenuCtrl', ["$scope", "$ionicModal", "$timeout",
      function ($scope, $ionicModal, $timeout) {

        // With the new view caching in Ionic, Controllers are only called
        // when they are recreated or on app start, instead of every page change.
        // To listen for when this page is active (for example, to refresh data),
        // listen for the $ionicView.enter event:
        //$scope.$on('$ionicView.enter', function(e) {
        //});

        // Form data for the login modal
        $scope.loginData = {};

        // Create the login modal that we will use later
        $ionicModal.fromTemplateUrl('templates/login.html', {
          scope: $scope
        }).then(function (modal) {
          $scope.modal = modal;
        });

        // Triggered in the login modal to close it
        $scope.closeLogin = function () {
          $scope.modal.hide();
        };

        // Open the login modal
        $scope.login = function () {
          $scope.modal.show();
        };

        // Perform the login action when the user submits the login form
        $scope.doLogin = function () {
          console.log('Doing login', $scope.loginData);

          // Simulate a login delay. Remove this and replace with your login
          // code if using a login system
          $timeout(function () {
            $scope.closeLogin();
          }, 1000);
        };
      }]);
  }
}






