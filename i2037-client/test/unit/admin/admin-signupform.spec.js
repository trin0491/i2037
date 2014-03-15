'use strict';

describe('i2037.admin.signupform', function() {
  beforeEach(function() {
    module('i2037.admin.signupform');
  });

  describe('SignUpFormCtrl', function() {
    var ctrl, scope, mockDialog, mockUser;

    beforeEach(function() {
      inject(function($rootScope, $controller) {
        scope = $rootScope.$new();

        mockDialog = jasmine.createSpyObj('$modalInstance', ['close']);
        mockUser = jasmine.createSpy('User');        
        var params = {
          $scope: scope,
          $modalInstance: mockDialog,
          User: mockUser,
        };
        ctrl = $controller('SignUpFormCtrl', params);
      });
    });

    it('cancel should close the dialog', function() {
      scope.cancel();
      scope.$digest();
      expect(mockDialog.close).toHaveBeenCalled();
    });
  });
});
