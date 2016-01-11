///<reference path="../../../typings/tsd.d.ts" />

import loginform from "../../../app/js/admin/admin-loginform";

describe('i2037.admin.loginform', function () {
  beforeEach(function () {
    angular.mock.module(loginform.name);
  });

  describe('LoginFormCtrl', function () {
    var ctrl, $scope, $location, mockSession, $q;

    beforeEach(function () {
      mockSession = jasmine.createSpyObj('Session', ['getUser', 'login']);

      inject(function (_$rootScope_, $controller, _$location_, _$q_) {
        $location = _$location_;
        $scope = _$rootScope_.$new();
        $q = _$q_;

        var params = {
          $scope: $scope,
          $location: _$location_,
          user: null,
          Session: mockSession
        };
        ctrl = $controller('LoginFormCtrl', params);

        spyOn($location, 'path').and.callThrough();
        spyOn($scope, '$emit');
      });
    });

    it('should define an empty userPM on the scope', function () {
      expect(ctrl.userPM).toBeDefined();
      expect(ctrl.userPM.userName).toBeUndefined();
      expect(ctrl.userPM.password).toBeNull();
      expect(ctrl.userPM.rememberMe).toBeTruthy();
    });

    it('should go to the home page on cancel', function () {
      ctrl.cancel();
      expect($location.path).toHaveBeenCalledWith('/home');
    });

    it('should login into a session on submit', function () {
      var deferred = $q.defer();
      mockSession.login.and.returnValue(deferred.promise);

      var userName = 'aUser';
      var password = 'aPassword';
      ctrl.userPM.userName = userName;
      ctrl.userPM.password = password;
      ctrl.userPM.rememberMe = false;
      ctrl.submit();
      expect(mockSession.login).toHaveBeenCalledWith(userName, password);

      deferred.resolve({});
      $scope.$apply();
      expect($location.path).toHaveBeenCalledWith('/home');
    });

    it('should raise an event on login error', function () {
      var deferred = $q.defer();
      mockSession.login.and.returnValue(deferred.promise);

      var userName = 'aUser';
      var password = 'aPassword';
      ctrl.userPM.userName = userName;
      ctrl.userPM.password = password;
      ctrl.userPM.rememberMe = false;
      ctrl.submit();
      expect(mockSession.login).toHaveBeenCalledWith(userName, password);

      deferred.reject({});
      $scope.$apply();
      expect($location.path).not.toHaveBeenCalled();
      expect($scope.$emit).toHaveBeenCalled();
    })
  });
});
