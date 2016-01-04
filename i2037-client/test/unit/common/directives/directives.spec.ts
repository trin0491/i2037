import directives from "../../../../app/js/common/directives/directives";

describe('i2037.directives', function () {
  beforeEach(function () {
    angular.mock.module(directives.name);
  });

  describe('app-version', function () {
    it('should print current version', function () {
      angular.mock.module(function ($provide) {
        $provide.value('version', 'TEST_VER');
      });
      inject(function ($compile, $rootScope) {
        var element = $compile('<span i2-app-version></span>')($rootScope);
        expect(element.text()).toEqual('TEST_VER');
      });
    });
  });

});