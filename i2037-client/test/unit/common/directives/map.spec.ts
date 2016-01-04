import map from "../../../../app/js/common/directives/map";

describe('i2037.directives.map', function () {
  beforeEach(function () {
    angular.mock.module(map.name);
  })


  describe('i2-map', function () {
    var $scope, element, $compile;

    beforeEach(function () {
      var html = '<div i2-map></div>';

      inject(function (_$compile_, _$rootScope_) {
        $scope = _$rootScope_;
        $compile = _$compile_;

        element = $compile(html)($scope);
      })
    });

    it('should have a google map', function () {
      expect(element.find('div').length).toBeTruthy();
    });

    it('should have add the class', function () {
      expect(element.hasClass('i2-map')).toBe(true);
    });

  });
});