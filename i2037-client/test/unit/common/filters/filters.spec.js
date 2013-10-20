
/* jasmine specs for filters go here */

describe('filter', function() {
  beforeEach(module('i2037.filters'));


  describe('interpolate', function() {
    beforeEach(module(function($provide) {
      $provide.value('version', 'TEST_VER');
    }));

    it('should replace VERSION', inject(function(interpolateFilter) {
      expect(interpolateFilter('before %VERSION% after')).toEqual('before TEST_VER after');
    }));
  });

  describe('dateSequence', function() {
    var filter;
    beforeEach(function() {
      inject(function(_dateSequenceFilter_) {
        filter = _dateSequenceFilter_;
      })
    });

    it('should ignore input unless it is an array', function() {
      var str = 'aString';
      expect(filter(str)).toEqual(str);
    });

    it('should return default format', function() {
      var dates = [ new Date("October 23, 1977 23:13:00") ];
      expect(filter(dates)).toEqual(['Oct 23, 1977']);
    });

    it('should return default format', function() {
      var dates = [ new Date("October 23, 1977 23:13:00") ];
      expect(filter(dates)).toEqual(['Oct 23, 1977']);
    });

    it('should return empty with no dates', function() {
      var dates = [ ];
      expect(filter(dates)).toEqual([]);
    })

    it('should use dateFormat with one date', function() {
      var dates = [ new Date("October 23, 1977 23:12:00") ];
      expect(filter(dates, 'yyyyMMdd H:mm:ss', 'H:mm:ss')).toEqual(['19771023 23:12:00']);
    })

    it('should use timeFormat if two dates are during the same day', function() {
      var dates = [ new Date("October 23, 1977 23:12:00"), new Date("October 23, 1977 23:40:01") ];
      expect(filter(dates, 'yyyyMMdd H:mm:ss', 'H:mm:ss')).toEqual(['19771023 23:12:00', '23:40:01']);
    })
  });

});
