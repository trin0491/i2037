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
      var html = '<div i2-timeline="entries" i2-selected="selected"><div id="contents"></div></div>';

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

    it('should have the first row with the date', function() {
      $scope.$digest();      
      expect(getCell(0, 0).text()).toEqual('Sunday 23 October');
    });

    it('should have a header row if all entries are on the same day', function() {
      $scope.$digest();
      expect(element.find('tr').length).toEqual(2);

      $scope.entries.push(new Entry("another entry"));
      $scope.$digest();

      expect(element.find('tr').length).toEqual(3);

      $scope.entries.pop();
      $scope.$digest();

      expect(element.find('tr').length).toEqual(2);
    });

    it('should create a new header row for the next day', function() {
      $scope.$digest();
      expect(element.find('tr').length).toEqual(2);

      var nextDay = new Entry("another entry");
      nextDay.date = new Date("October 24, 1977 23:13:00")
      $scope.entries.push(nextDay);
      $scope.$digest();

      expect(element.find('tr').length).toEqual(4);
      expect(getCell(0, 2).text()).toEqual('Monday 24 October');
    });

    it('should have an optional selected entry', function() {
      element = $compile('<div i2-timeline="entries"></div>')($scope);
      $scope.$digest();
      expect(element.find('tr').eq(1).hasClass('info')).toBeFalsy();
    });

    it('should highlight the selected entry when scope is updated', function() {
      $scope.$digest();
      expect(element.find('tr').eq(1).hasClass('info')).toBeTruthy();

      $scope.entries.push(new Entry("not selected"));
      $scope.$digest();
      expect(element.find('tr').eq(2).hasClass('info')).toBeFalsy();

      $scope.selected = $scope.entries[1];
      $scope.$digest();
      expect(element.find('tr').eq(2).hasClass('info')).toBeTruthy();      
    });

    it('should update selected when a row is clicked', function() {
      $scope.selected = undefined;
      $scope.entries.push(new Entry("not selected"));
      $scope.$digest();
      expect($scope.selected).toBeUndefined();

      element.find('tr').eq(1).click();
      expect(element.find('tr').eq(1).hasClass('info')).toBeTruthy();
      expect($scope.selected).toEqual($scope.entries[0]);
    });

    it('should unselect an entry when it is clicked twice', function() {
      $scope.$digest();
      expect(element.find('tr').eq(1).hasClass('info')).toBeTruthy();
      element.find('tr').eq(1).click();
      expect(element.find('tr').eq(1).hasClass('info')).toBeFalsy();
    });

    it('should format entry date as a time', function() {
      $scope.$digest();
      expect(getCell(0,1).text()).toEqual("23:13");
    });

    it('should tranclude the content', function() {
      $scope.$digest();
      expect(element.find('div').length).toEqual(1);
    })
  })

});