describe('filter', function() {
  beforeEach(module('i2037.services'));

  describe('Session', function() {
    var sessionSvc, $rootScope;
    beforeEach(function() {
      inject(function(_Session_, _$rootScope_) {
        sessionSvc = _Session_;
        $rootScope = _$rootScope_;
      });

      spyOn($rootScope, '$broadcast');
    });

    it('raises event on auth failure', function() {
      sessionSvc.onAuthFailure();
      expect($rootScope.$broadcast).toHaveBeenCalledWith('SessionService::AuthRequired');
    })
  });
});