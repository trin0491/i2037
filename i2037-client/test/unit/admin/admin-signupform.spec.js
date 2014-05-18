'use strict';

describe('i2037.admin.signupform', function() {
  beforeEach(function() {
    module('i2037.admin.signupform');
  });

  describe('SignUpFormCtrl', function() {
    var ctrl, $scope, $location, mockUser, mockSession;

    beforeEach(function() {
      inject(function(_$rootScope_, $controller, _$location_) {
        $location = _$location_;
        $scope = _$rootScope_.$new();

        mockSession = jasmine.createSpyObj('Session', ['signup']);
        mockUser = jasmine.createSpy('User');        
        var params = {
          $scope: $scope,
          $location: _$location_,
          User: mockUser,
          Session: mockSession
        };
        ctrl = $controller('SignUpFormCtrl', params);

        spyOn($location, 'path').andCallThrough();
      });
    });

    it('cancel should return to the home page', function() {
      $scope.cancel();
      $scope.$digest();
      expect($location.path).toHaveBeenCalledWith('/home');
    });
  });
});
