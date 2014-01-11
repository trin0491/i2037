describe('i2037.journal.calendar', function() {
  beforeEach(function() {
    module('i2037.journal.calendar');
  });

  describe('JournalCalendarCtrl', function() {
    var ctrl, scope, MovesSummary, location;

    beforeEach(function() {
      inject(function($rootScope, $controller) {
        scope = $rootScope.$new();
        location = jasmine.createSpyObj('$location', ['path']);
        MovesSummary = jasmine.createSpyObj('MovesSummary', ['get']);          
        var params = {
          $scope: scope,
          $location: location,
          MovesSummary: MovesSummary,          
        };
        ctrl = $controller('JournalCalendarCtrl', params);
      });
    });

    it('should define the calendar config', function() {
      expect(scope.uiConfig).toBeDefined();
    });

    it('should update location when a day is clicked', function() {
      var d = new Date('2014', '0', '10');
      scope.uiConfig.calendar.dayClick(d);
      expect(location.path).toHaveBeenCalledWith('/journal/date/20140110');
    });

    it('should ignore clicks on dates in the future', function() {
      var d = new Date();
      d.setDate(d.getDate()+1);
      scope.uiConfig.calendar.dayClick(d);
      expect(location.path).not.toHaveBeenCalled();
    });

  });
});