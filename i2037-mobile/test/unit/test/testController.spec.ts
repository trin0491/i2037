/**
 * Created by richard on 13/09/2015.
 */
///<reference path="../../../typings/tsd.d.ts" />
import TestModule = require('www/js/test/TestModule');

describe("testController", function() {
  var $scope;

  beforeEach(function () {
    module(TestModule.NAME);
    inject(function($rootScope, $controller) {
      $scope = $rootScope.$new();
      $controller('test as ctrl', {$scope:$scope});
    });
  });

  it('should be defined', function() {
    expect($scope.ctrl).toBeDefined();
  });

  it('should have an onClick function', function() {
    expect(angular.isFunction($scope.ctrl.onClick)).toBeTruthy();
  })

  it('should have an onMousedown function', function() {
    expect(angular.isFunction($scope.ctrl.onMousedown)).toBeTruthy();
  })

  it('should have an onMouseup function', function() {
    expect(angular.isFunction($scope.ctrl.onMousedown)).toBeTruthy();
  })
});