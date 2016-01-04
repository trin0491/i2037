import mapFlyout from "../../../../app/js/common/directives/map-flyout";

describe('i2037.directives.mapFlyout', function () {
  beforeEach(function () {
    angular.mock.module(mapFlyout.name);
  })

  describe('i2-flyout', function () {
    var $scope, element, $compile;

    beforeEach(function () {
      var html = '<div i2-map-flyout></div>';

      inject(function (_$compile_, _$rootScope_) {
        $scope = _$rootScope_;
        $compile = _$compile_;

        element = $compile(html)($scope);
      })
    });

    it('should have a google map', function () {
      expect(element.find('div').length).toBeTruthy();
    });

  });
});