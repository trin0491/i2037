'use strict';

describe('i2037.admin.signupform', function() {

  beforeEach(function() {
    module('i2037.admin.signupform');
  });

  function newMockSession() {
    return jasmine.createSpyObj('Session', ['signup', 'login', 'logout']);
  }

  describe('SignUpFormCtrl creating a new user', function() {
    var ctrl, $scope, $location, $q, mockUser, mockSession;

    beforeEach(function() {
      inject(function(_$rootScope_, $controller, _$location_, _$q_, User) {
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
        ctrl = $controller('SignUpFormCtrl', params);

        spyOn($location, 'path').andCallThrough();
      });
    });

    it('should set the user on the scope', function() {
      expect($scope.userPM).toEqual(mockUser);
    });

    it('should set the title', function() {
      expect($scope.title).toEqual("Sign Up");
    });

    it('should set the user name to read only', function() {
      expect($scope.isNewUser).toBeTruthy();
    });

    it('should go to the home page on cancel', function() {
      $scope.cancel();
      $scope.$digest();
      expect($location.path).toHaveBeenCalledWith('/home');
    });

    it('should sign up the user with a session on submit', function() {
      var deferred = $q.defer();
      mockSession.signup.andReturn(deferred.promise);

      $scope.submit();
      expect(mockSession.signup).toHaveBeenCalled();

      deferred.resolve(mockUser);
      $scope.$apply();
      expect($location.path).toHaveBeenCalledWith('/home');
    })
  });

  describe('SignUpFormCtrl updating an existing user', function() {
    var ctrl, $scope, $location, mockUser, mockSession, $q;

    beforeEach(function() {
      mockSession = newMockSession();
      mockUser = jasmine.createSpyObj('user', ['$id', '$save', '$update']);
      mockUser.$id.andReturn('aUser');
      mockUser.userName = 'aMockUser';
      mockUser.password = 'aPassword';

      inject(function(_$rootScope_, $controller, _$location_, _$q_) {
        $location = _$location_;
        $scope = _$rootScope_.$new();
        $q = _$q_;

        var params = {
          $scope: $scope,
          $location: _$location_,
          user: mockUser,
          Session: mockSession          
        };
        ctrl = $controller('SignUpFormCtrl', params);

        spyOn($location, 'path').andCallThrough();
      });
    });

    it('should set the user on the scope', function() {
      expect($scope.userPM).toEqual(mockUser);
    });

    it('should set the title', function() {
      expect($scope.title).toEqual("Change Password");
    });

    it('should set the user name to read only', function() {
      expect($scope.isNewUser).toBeFalsy();
    });

    it('should save user on submit', function() {
      var deferred = $q.defer();
      mockUser.$update.andReturn(deferred.promise);

      var password = 'aNewPassword';
      $scope.userPM.password = password;
      $scope.userPM.rememberMe = false;
      $scope.submit();
      expect(mockUser.$update).toHaveBeenCalled();

      deferred.resolve();
      $scope.$apply();
      expect($location.path).toHaveBeenCalledWith('/home');
    })

  });  
});
