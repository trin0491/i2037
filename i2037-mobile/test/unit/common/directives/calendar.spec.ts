///<reference path="../../../../typings/tsd.d.ts" />
describe('i2037.directives.calendar', function() {
    beforeEach(function() {
        debugger;
        module('i2037.directives.calendar');
    });

    describe('i2Calendar', function() {
      var $scope, calendar;
      beforeEach(function() {
        inject(function(_$rootScope_, _$compile_) {
            $scope = _$rootScope_;
        });
      })

      it('should have a scope', function() {
          expect($scope).toBeDefined();
      })
    });
});