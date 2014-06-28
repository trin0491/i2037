describe('i2037.fx.directives.orderBook', function() {
  beforeEach(module('i2037.fx.directives.orderBook'));

  describe('i2OrderBook', function() {
    var $scope, element, $compile;

    beforeEach(function() {  
      inject(function(_$compile_, _$rootScope_) {
        $compile = _$compile_;
        $scope = _$rootScope_.$new();
      });
      $scope.ob = {
        rungs: [
          {px:1.3264, amts:[10],   srcs: ['MSMM']},
          {px:1.3265, amts:[12,5], srcs: ['MSP1']}
        ]
      };
      element = compile('<i2-order-book ob="ob" highlight="highlight"></i2-order-book>');
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
    })

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
    })
  });
});
