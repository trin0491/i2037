describe('i2037.journal.calendar', function() {
  beforeEach(function() {
    module('i2037.journal.calendar');
  });

  describe('JournalCalendarCtrl', function() {
    var ctrl, scope, rootScope, compile, JournalSummary, location, deferred;

    beforeEach(function() {
      inject(function($rootScope, $controller, $q, Journal) {
        scope = $rootScope.$new();
        location = jasmine.createSpyObj('$location', ['path']);
        deferred = $q.defer();
        JournalSummary = jasmine.createSpyObj('JournalSummary', ['query']);
        JournalSummary.query.andReturn(deferred.promise);
        rootScope = $rootScope;
        spyOn($rootScope, '$broadcast');
        compile = jasmine.createSpy('$compile');          
        var params = {
          $scope: scope,
          $rootScope: $rootScope,
          $compile: compile,
          $location: location,
          Journal: Journal,
          JournalSummary: JournalSummary,
          date: { year: 2014, month: 0 }, // January in date         
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

    it('should raise an error if loading fails', function() {
      expect(scope.eventSources[0]).toBeDefined();
      var end = new Date();
      var start = new Date();
      start.setDate(end.getDate() - 30);
      scope.eventSources[0](start, end);
      expect(JournalSummary.query).toHaveBeenCalled();
      scope.$apply(function() {
        deferred.reject('Journal load failed');
      });
      expect(rootScope.$broadcast).toHaveBeenCalled();
    })

    it('should decrement month and year when prev is called', function() {
      scope.prev();
      expect(location.path).toHaveBeenCalledWith('/journal/month/201312');      
    })

    it('should increment month when next is called', function() {
      scope.next();
      expect(location.path).toHaveBeenCalledWith('/journal/month/201402');      
    })

    it('should increment month when next is called', function() {
      scope.next();
      expect(location.path).toHaveBeenCalledWith('/journal/month/201402');      
    })

    it('should go to today when today is called', function() {
      scope.today();
      var now = new Date();
      function pad(n){return n<10 ? '0'+n : n;}    
      var expectedPath = '/journal/month/' + now.getFullYear() + pad(now.getMonth() + 1)
      expect(location.path).toHaveBeenCalledWith(expectedPath);      
    })

  });
});