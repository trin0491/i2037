///<reference path="../../../../typings/tsd.d.ts" />
describe('i2037.directives.calendar', function() {
    beforeEach(function() {
        debugger;
        module('i2037.directives.calendar');
    });

    describe('i2Calendar', function() {
      var $scope, calendar, $compile:ng.ICompileService;
      beforeEach(function() {
        inject(function(_$rootScope_, _$compile_:ng.ICompileService) {
            $scope = _$rootScope_;
            $compile = _$compile_;
        });
        calendar = $compile("<i2-calendar></i2-calendar>")($scope);
      })

      it('should be defined', function() {
          expect(calendar).toBeDefined();
      })
    });
});