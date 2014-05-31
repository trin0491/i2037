describe('i2037.services', function() {
  beforeEach(module('i2037.services'));

  describe('Session', function() {
    var Session, $rootScope, mockUser, $q;
    beforeEach(function() {

      mockUser = jasmine.createSpyObj('User', ['login', 'logout', 'get']);

      module(function($provide) {
        $provide.value('User', mockUser);
      });

      inject(function(_Session_, _$rootScope_, _$location_, _$q_) {
        Session = _Session_;
        $rootScope = _$rootScope_;
        $q = _$q_;
      });

      spyOn($rootScope, '$broadcast').andCallThrough();
    });

    it('getUser will lookup the user once and raise a LOGGED_IN event', function() {
      var deferred = $q.defer();
      mockUser.get.andReturn(deferred.promise);
      
      var p = Session.getUser();
      expect(p).toBeDefined();
      expect(mockUser.get).toHaveBeenCalled();      
      var user;
      p.then(function(value) {user = value;});
      expect(user).toBeUndefined();
      expect($rootScope.$broadcast).not.toHaveBeenCalledWith('SessionService::StateChange', 'LOGGED_IN');

      deferred.resolve("aUser");
      $rootScope.$apply();
      expect(user).toEqual("aUser");
      expect($rootScope.$broadcast).toHaveBeenCalledWith('SessionService::StateChange', 'LOGGED_IN');

      p = Session.getUser();
      expect(mockUser.get.calls.length).toEqual(1);
    });

    it('should raise a LOGGED_IN event when login is successful', function() {
      var deferred = $q.defer();
      mockUser.login.andReturn(deferred.promise);
      var p = Session.login('aUser', 'aPassword');
      expect(p).toBeDefined();
      expect(mockUser.login).toHaveBeenCalledWith('aUser', 'aPassword');
      expect($rootScope.$broadcast).not.toHaveBeenCalledWith('SessionService::StateChange', 'LOGGED_IN');
      var user;
      p.then(function (value) { user = value;});
      expect(user).toBeUndefined();

      deferred.resolve("aUser");
      $rootScope.$apply();
      expect(user).toEqual("aUser");
      expect($rootScope.$broadcast).toHaveBeenCalledWith('SessionService::StateChange', 'LOGGED_IN');
      expect(Session.getState(), 'LOGGED_IN');
    });

    it('should not raise a LOGGED_IN event when login fails', function() {
      var deferred = $q.defer();
      mockUser.login.andReturn(deferred.promise);
      var p = Session.login('aUser', 'aPassword');
      expect(p).toBeDefined();
      expect(mockUser.login).toHaveBeenCalledWith('aUser', 'aPassword');
      deferred.reject("Something bad happened");
      $rootScope.$apply();
      expect($rootScope.$broadcast).not.toHaveBeenCalledWith('SessionService::StateChange', 'LOGGED_IN');
      expect(Session.getState(), 'LOGGED_OUT');
    });
  });

  describe('d3Service', function() {
    var d3Svc, $rootScope;
    beforeEach(function() {
      inject(function(_d3Service_, _$rootScope_) {
        d3Svc = _d3Service_;
        $rootScope = _$rootScope_;
      });
    });

    it('provides the d3 global', function() {
      expect(d3Svc).toBeDefined();
    })
  });

});