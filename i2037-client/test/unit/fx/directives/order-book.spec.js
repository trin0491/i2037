describe('i2037.fx.directives.orderBook', function() {
  beforeEach(module('i2037.fx.directives.orderBook'));

  describe('i2OrderBook', function() {
    var $scope, element, $compile, mockPx;

    beforeEach(function() {  
      inject(function(_$compile_, _$rootScope_) {
        $compile = _$compile_;
        $scope = _$rootScope_.$new();
      });
      mockPx = jasmine.createSpyObj('Price', ['getPips']);
      $scope.ob = {
        rungs: [
          {px:mockPx, cumAmt:10, amts:[10],   srcs: ['MSMM']},
          {px:mockPx, cumAmt:28, amts:[12,5], srcs: ['MSP1']}
        ]
      };
      element = compile('<i2-order-book ob="ob" highlight="highlight" level="level"></i2-order-book>');
    });

    function compile(html) {
      var element = $compile(html)($scope);
      $scope.$digest();
      return element;
    }

    it('should compile', function() {
      expect(element).toBeDefined();
    });

    it('should have a table', function() {
      expect(element.find('table').length).toBe(1);
    });

    it('should have a row for each rung', function() {
      expect(element.find('tr').length).toBe(2);
      $scope.ob = {rungs:[]};
      $scope.$digest();
      expect(element.find('tr').length).toBe(0);
    });

    it('should have a price in the 1st column, if left aligned', function() {
      mockPx.getPips.andReturn('1.3264');
      $scope.$digest();
      var td = element.find('td');
      expect(td.eq(0).text()).toEqual('1.3264');
    });

    it('should have an amount in the 2nd column, if left aligned', function() {
      $scope.$digest();
      var td = element.find('td');
      expect(td.eq(1).text()).toEqual('10');
    });

    it('should have a depth chart in the 3rd column, if left aligned', function() {
      $scope.$digest();
      var td = element.find('td');
      expect(td.eq(2).attr("i2-depth-chart")).toBeDefined();
      expect(td.eq(2).attr("align")).toEqual("left");      
    });

    it('should have a price in the 3rd column, if right aligned', function() {
      element = compile('<i2-order-book ob="ob" align="right"></i2-order-book>');      
      mockPx.getPips.andReturn('1.3264');
      $scope.$digest(); 
      var td = element.find('td');
      expect(td.eq(2).text()).toEqual('1.3264');
    });

    it('should have an amount in the 2rd column, if right aligned', function() {
      element = compile('<i2-order-book ob="ob" align="right"></i2-order-book>');            
      var td = element.find('td');
      expect(td.eq(1).text()).toEqual('10');
    });

    it('should have a depth chart in the 3rd column, if left aligned', function() {
      element = compile('<i2-order-book ob="ob" align="right"></i2-order-book>');                  
      var td = element.find('td');
      expect(td.eq(0).attr("i2-depth-chart")).toBeDefined();
      expect(td.eq(0).attr("align")).toEqual("right");
    });

    it('should give each row an index', function() {
      function expectHasHighlights(rows) {
        for (var i=0;i<rows.length;++i) {
          var hasClass = rows.eq(i).hasClass('x-ob-highlight');
          if (i < $scope.highlight) {
            expect(hasClass).toBeTruthy();
          } else {
            expect(hasClass).toBeFalsy();
          }
        }        
      }

      $scope.highlight = 1;
      $scope.$digest();
      var rows = element.find('tr');
      expectHasHighlights(rows);
      $scope.highlight = 3;
      $scope.$digest();
      expectHasHighlights(rows);
    });

    it('should give mark one row with the normal amount', function() {
      var rows = element.find('tr');
      expect(rows.hasClass('x-ob-normamt-level')).toBeFalsy();
      expect(rows.hasClass('x-ob-level')).toBeTruthy();      
      $scope.level = 1;
      $scope.$digest();
      expect(rows.eq(0).hasClass('x-ob-level')).toBeTruthy();
      expect(rows.eq(0).hasClass('x-ob-normamt-level')).toBeFalsy();
      expect(rows.eq(1).hasClass('x-ob-level')).toBeFalsy();
      expect(rows.eq(1).hasClass('x-ob-normamt-level')).toBeTruthy();
    });
  });
});
