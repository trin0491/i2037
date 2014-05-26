'use strict';

describe('i2037.admin.loginform', function() {
  beforeEach(function() {
    module('i2037.admin.loginform');    
  });

  describe('LoginFormCtrl', function() {
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
        spyOn($scope, '$emit');
      });
    });

    it('should define an empty userPM on the scope', function() {
      expect($scope.userPM).toBeDefined();
      expect($scope.userPM.userName).toBeUndefined();
      expect($scope.userPM.password).toBeNull();
      expect($scope.userPM.rememberMe).toBeTruthy();
    })

    it('should go to the home page on cancel', function() {
      $scope.cancel();
      expect($location.path).toHaveBeenCalledWith('/home');
    });

    it('should login into a session on submit', function() {
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

    it('should raise an event on login error', function() {
      var deferred = $q.defer();
      mockSession.login.andReturn(deferred.promise);

      var userName = 'aUser';
      var password = 'aPassword';
      $scope.userPM.userName = userName;
      $scope.userPM.password = password;
      $scope.userPM.rememberMe = false;
      $scope.submit();
      expect(mockSession.login).toHaveBeenCalledWith(userName, password);

      deferred.reject({});
      $scope.$apply();
      expect($location.path).not.toHaveBeenCalled();
      expect($scope.$emit).toHaveBeenCalled();
    })
  });
});
