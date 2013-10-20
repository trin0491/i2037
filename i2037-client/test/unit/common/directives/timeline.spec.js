describe('i2037.directives.timeline', function() {
  beforeEach(function() {
    module('i2037.directives.timeline');
  });

  describe('i2037-timeline', function() {
    var $scope, element, $compile;

    function Entry(text) {
      this.date = new Date("October 23, 1977 23:13:00");
      this.text = text;
    }

    beforeEach(function() {
      var html = '<div i2-timeline="entries" i2-selected="selected"></div>';

      inject(function(_$compile_, _$rootScope_) {
        $scope = _$rootScope_;
        $compile = _$compile_;

        $scope.entries = [ new Entry("some text") ];
        $scope.selected = $scope.entries[0];
        element = $compile(html)($scope);        
      });
    });

    function getCell(col, row) {
      var tr = element.find('tr').eq(row);
      return tr.children('td').eq(col);
    }

    it('should have same no of rows as entries', function() {
      $scope.$digest();

      expect(element.find('tr').length).toEqual(1);

      $scope.entries.push(new Entry("another entry"));
      $scope.$digest();

      expect(element.find('tr').length).toEqual(2);

      $scope.entries.pop();
      $scope.$digest();

      expect(element.find('tr').length).toEqual(1);
    });

    it('should have an optional selected entry', function() {
      element = $compile('<div i2-timeline="entries"></div>')($scope);
      $scope.$digest();
      expect(element.find('tr').eq(0).hasClass('info')).toBeFalsy();
    });

    it('should highlight the selected entry when scope is updated', function() {
      $scope.$digest();
      expect(element.find('tr').eq(0).hasClass('info')).toBeTruthy();

      $scope.entries.push(new Entry("not selected"));
      $scope.$digest();
      expect(element.find('tr').eq(1).hasClass('info')).toBeFalsy();

      $scope.selected = $scope.entries[1];
      $scope.$digest();
      expect(element.find('tr').eq(1).hasClass('info')).toBeTruthy();      
    });

    it('should update selected when a row is clicked', function() {
      $scope.selected = undefined;
      $scope.entries.push(new Entry("not selected"));
      $scope.$digest();
      expect($scope.selected).toBeUndefined();

      element.find('tr').eq(0).click();
      expect(element.find('tr').eq(0).hasClass('info')).toBeTruthy();
      expect($scope.selected).toEqual($scope.entries[0]);
    });

    it('should unselect an entry when it is clicked twice', function() {
      $scope.$digest();
      expect(element.find('tr').eq(0).hasClass('info')).toBeTruthy();
      element.find('tr').eq(0).click();
      expect(element.find('tr').eq(0).hasClass('info')).toBeFalsy();
    });

    it('should format the date', function() {
      $scope.$digest();
      expect(getCell(0,0).text()).toEqual("23/10/77 23:13hrs");
    });
  })

});