'use strict';

describe('i2037.admin.loginform', function() {
  beforeEach(function() {
    module('i2037.admin.loginform');    
  });

  describe('LoginFormCtrl without an existing user', function() {
    var ctrl, $scope, $location, mockSession, $q;

    beforeEach(function() {
      mockSession = jasmine.createSpyObj('Session', ['getUser','login']);

      inject(function(_$rootScope_, $controller, _$location_, _$q_) {
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

        spyOn($location, 'path').andCallThrough();
      });
    });

    it('should define an empty userPM on the scope', function() {
      expect($scope.userPM).toBeDefined();
      expect($scope.userPM.userName).toBeUndefined();
      expect($scope.userPM.password).toBeNull();
      expect($scope.userPM.rememberMe).toBeTruthy();
      expect($scope.title).toEqual("Login");
    })

    it('should go to the home page on cancel', function() {
      $scope.cancel();
      expect($location.path).toHaveBeenCalledWith('/home');
    });

    it('should call login into a session on submit', function() {
      var deferred = $q.defer();
      mockSession.login.andReturn(deferred.promise);

      var userName = 'aUser';
      var password = 'aPassword';
      $scope.userPM.userName = userName;
      $scope.userPM.password = password;
      $scope.userPM.rememberMe = false;
      $scope.submit();
      expect(mockSession.login).toHaveBeenCalledWith(userName, password);

      deferred.resolve({});
      $scope.$apply();
      expect($location.path).toHaveBeenCalledWith('/home');
    })

  });

  describe('LoginFormCtrl without an existing user', function() {
    var ctrl, $scope, $location, mockUser, mockSession, $q;

    beforeEach(function() {
      mockSession = jasmine.createSpyObj('Session', ['changePassword']);
      mockUser = jasmine.createSpyObj('User', ['$id', '$save'])
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
        ctrl = $controller('LoginFormCtrl', params);

        spyOn($location, 'path').andCallThrough();
      });
    });

    it('should define an empty userPM on the scope', function() {
      expect($scope.userPM).toBeDefined();
      expect($scope.userPM.userName).toEqual('aMockUser');
      expect($scope.userPM.password).toBeNull();
      expect($scope.userPM.rememberMe).toBeTruthy();
      expect($scope.title).toEqual("Change Password");
    })

    it('should call changepassword on submit', function() {
      var deferred = $q.defer();
      mockSession.changePassword.andReturn(deferred.promise);

      var password = 'aNewPassword';
      $scope.userPM.password = password;
      $scope.userPM.rememberMe = false;
      $scope.submit();
      expect(mockSession.changePassword).toHaveBeenCalledWith(password);

      deferred.resolve();
      $scope.$apply();
      expect($location.path).toHaveBeenCalledWith('/home');
    })

  });
});
