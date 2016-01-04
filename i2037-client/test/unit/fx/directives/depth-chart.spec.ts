import depthChart from "../../../../app/js/fx/directives/depth-chart";

describe('i2037.fx.directives.depthChart', function () {
  beforeEach(angular.mock.module(depthChart.name));

  describe('i2DepthChart', function () {
    var $scope, element, $compile;

    beforeEach(function () {
      inject(function (_$compile_, _$rootScope_) {
        $compile = _$compile_;
        $scope = _$rootScope_.$new();
      });
      $scope.data = [];
      $scope.max = 10;
      element = compile('<div style="width:100px;height:20px" i2-depth-chart data="data" max="max"></div>');
    });

    function compile(html) {
      var element = $compile(html)($scope);
      $scope.$digest();
      return element;
    }

    function getBars() {
      return element.find('rect');
    }

    it('should compile', function () {
      expect(element).toBeDefined();
    });

    it('should show nothing with no data', function () {
      var bars = getBars();
      expect(bars.length).toEqual(0);
    });

    it('should have a bar for each data item', function () {
      $scope.data.push(2);
      $scope.$digest();
      expect(getBars().length).toEqual(1);
      $scope.data.push(3);
      $scope.$digest();
      expect(getBars().length).toEqual(2)
      $scope.data.splice(0, 1);
      $scope.$digest();
      expect(getBars().length).toEqual(1);
    });

    it('should create bars with a width proportional to the max size', function () {
      $scope.data.push(10);
      $scope.$digest();
      expect(getBars().eq(0).attr('width')).toEqual('100');
      $scope.data[0] = 5;
      $scope.$digest();
      expect(getBars().eq(0).attr('width')).toEqual('50');
    })

    it('should have a gap of 2px between bars', function () {
      $scope.data = [5, 5];
      $scope.$digest();
      var bars = getBars();
      expect(bars.eq(0).attr('width')).toEqual('49'); // 2px gap            
      expect(bars.eq(1).attr('width')).toEqual('49');
    })
  });
});
