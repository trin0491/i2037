describe('i2037.directives.d3', function() {
  beforeEach(function() {
    module('i2037.directives.d3');
  });

  describe('i2-pie', function() {
    var $scope, element, $compile, $window, data;

    beforeEach(function() {
      var html = '<div i2-pie i2-selected="selected" data="mockData" style="width:30px;height:40px"></div>';
      data = [];
      inject(function(_$compile_, _$rootScope_, _$window_) {
        $window = _$window_;
        $scope = _$rootScope_.$new();
        $scope.mockData = data;
        $compile = _$compile_;
        element = $compile(html)($scope);        
      });
    });

    it('should create an svg element', function() {
      expect(element.find('svg').length).toBe(1);
    });

    it('should have a style', function() {
      expect(element.find('svg').css('width')).toBe('100%');
      expect(element.find('svg').css('height')).toBe('100%');      
    });

    it('should translate to the center of the element', function() {
      $scope.$digest();
      var grps = element.find('g');
      expect(grps.length).toBe(1);
      expect(grps.attr('transform')).toBe("translate(15,20)");
      expect(element.find("path").length).toBe(0);
    });

    it('should create a circle for 1 data item', function() {
      data.push(10);
      $scope.$digest();
      var grps = element.find("path");
      expect(grps.length).toBe(1);      
    });

    it('should add a sector when an item as added', function() {
      data.push(10);
      $scope.$digest();
      expect(element.find("path").length).toBe(1);
      data.push(20);
      $scope.$digest();
      expect(element.find("path").length).toBe(2);      
    });

    it('should remove a sector when an item is removed', function() {
      data.push(10,20,30);
      $scope.$digest();
      expect(element.find("path").length).toBe(3);
      data.pop();
      $scope.$digest();
      expect(element.find("path").length).toBe(2);            
    });

    it('should have an outer radius of half the smallest dimension', function() {
      data.push(150);
      $scope.$digest();
      data[0] = 50;
      $scope.$digest();
      var matches = element.find("path").attr("d").match(/^M.*,(\d+)A/);
      expect(matches[1]).toBe('15');
    });

    it('should have a radius proportional to the max-sum', function() {
      element = $compile('<div i2-pie i2-selected="selected" data="mockData" max="100" style="width:40px;height:40px"></div>')($scope);              
      $scope.mockData = [25,25];
      $scope.$digest();
      $scope.mockData[1] = 0;
      $scope.$digest();
      var matches = element.find("path").attr("d").match(/,-(\d+)A/);
      expect(matches[1]).toBe('5');  // 25% of 20px
    });

    it('should show max radius if the sum is larger than max-sum', function() {
      element = $compile('<div i2-pie i2-selected="selected" data="mockData" max="100" style="width:40px;height:40px"></div>')($scope);              
      $scope.mockData = [100,25];
      $scope.$digest();
      var matches = element.find("path").attr("d").match(/,-(\d+)A/);
      expect(matches[1]).toBe('20');
    });

    it('should have an inner radius proportional to the outer radius', function() {
      data.push(50);
      element = $compile('<div i2-pie i2-selected="selected" data="mockData" max="100" '
        + 'inner-radius-ratio="0.5" style="width:40px;height:40px"></div>')($scope);              
      $scope.$digest();
      var outerRadius = element.find("path").attr("d").match(/M0,(\d+)/);
      expect(outerRadius[1]).toBe('10');
      var innerRadius = element.find("path").attr("d").match(/.+M0,(\d+)/);
      expect(innerRadius[1]).toBe('5');
    });    
  })
});