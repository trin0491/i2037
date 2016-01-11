///<reference path="../../../typings/tsd.d.ts" />

import signupform from "../../../app/js/admin/admin-signupform";

describe('i2037.admin.signupform', function () {

  beforeEach(function () {
    angular.mock.module(signupform.name);
  });

  function newMockSession() {
    return jasmine.createSpyObj('Session', ['signup', 'login', 'logout']);
  }

  describe('SignUpForm creating a new user', function () {
    var ctrl, $scope, $location, $q, mockUser, mockSession;

    beforeEach(function () {
      inject(function (_$rootScope_, $controller, _$location_, _$q_, User) {
        $location = _$location_;
        $scope = _$rootScope_.$new();
        $q = _$q_;

        mockSession = newMockSession();
        mockUser = new User();
        var params = {
          $scope: $scope,
          $location: _$location_,
          user: mockUser,
          Session: mockSession
        };
        ctrl = $controller('SignUpForm', params);

        spyOn($location, 'path').and.callThrough();
      });
    });

    it('should set the user on the scope', function () {
      expect(ctrl.userPM).toEqual(mockUser);
    });

    it('should set the title', function () {
      expect(ctrl.title).toEqual("Sign Up");
    });

    it('should set the user name to read only', function () {
      expect(ctrl.isNewUser).toBeTruthy();
    });

    it('should go to the home page on cancel', function () {
      ctrl.cancel();
      $scope.$digest();
      expect($location.path).toHaveBeenCalledWith('/home');
    });

    it('should sign up the user with a session on submit', function () {
      var deferred = $q.defer();
      mockSession.signup.and.returnValue(deferred.promise);

      ctrl.submit();
      expect(mockSession.signup).toHaveBeenCalled();

      deferred.resolve(mockUser);
      $scope.$apply();
      expect($location.path).toHaveBeenCalledWith('/home');
    })
  });

  describe('SignUpForm updating an existing user', function () {
    var ctrl, $scope, $location, mockUser, mockSession, $q;

    beforeEach(function () {
      mockSession = newMockSession();
      mockUser = jasmine.createSpyObj('user', ['$id', '$save', '$update']);
      mockUser.$id.and.returnValue('aUser');
      mockUser.userName = 'aMockUser';
      mockUser.password = 'aPassword';

      inject(function (_$rootScope_, $controller, _$location_, _$q_) {
        $location = _$location_;
        $scope = _$rootScope_.$new();
        $q = _$q_;

        var params = {
          $scope: $scope,
          $location: _$location_,
          user: mockUser,
          Session: mockSession
        };
        ctrl = $controller('SignUpForm', params);

        spyOn($location, 'path').and.callThrough();
      });
    });

    it('should set the user on the scope', function () {
      expect(ctrl.userPM).toEqual(mockUser);
    });

    it('should set the title', function () {
      expect(ctrl.title).toEqual("Change Password");
    });

    it('should set the user name to read only', function () {
      expect(ctrl.isNewUser).toBeFalsy();
    });

    it('should save user on submit', function () {
      var deferred = $q.defer();
      mockUser.$update.and.returnValue(deferred.promise);

      var password = 'aNewPassword';
      ctrl.userPM.password = password;
      ctrl.userPM.rememberMe = false;
      ctrl.submit();
      expect(mockUser.$update).toHaveBeenCalled();

      deferred.resolve();
      $scope.$apply();
      expect($location.path).toHaveBeenCalledWith('/home');
    })

  });
});
