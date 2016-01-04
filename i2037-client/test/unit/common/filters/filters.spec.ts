import filters from "../../../../app/js/common/filters";
/* jasmine specs for filters go here */

describe('filter', function () {
  beforeEach(angular.mock.module(filters.name));


  describe('interpolate', function () {
    beforeEach(angular.mock.module(function ($provide) {
      $provide.value('version', 'TEST_VER');
    }));

    it('should replace VERSION', inject(function (interpolateFilter) {
      expect(interpolateFilter('before %VERSION% after')).toEqual('before TEST_VER after');
    }));
  });

  describe('dateSequence', function () {
    var filter;
    beforeEach(function () {
      inject(function (_dateSequenceFilter_) {
        filter = _dateSequenceFilter_;
      })
    });

    it('should ignore input unless it is an array', function () {
      var str = 'aString';
      expect(filter(str)).toEqual(str);
    });

    it('should return default format', function () {
      var dates = [new Date("October 23, 1977 23:13:00")];
      expect(filter(dates)).toEqual(['Oct 23, 1977']);
    });

    it('should return default format', function () {
      var dates = [new Date("October 23, 1977 23:13:00")];
      expect(filter(dates)).toEqual(['Oct 23, 1977']);
    });

    it('should return empty with no dates', function () {
      var dates = [];
      expect(filter(dates)).toEqual([]);
    })

    it('should use dateFormat with one date', function () {
      var dates = [new Date("October 23, 1977 23:12:00")];
      expect(filter(dates, 'yyyyMMdd H:mm:ss', 'H:mm:ss')).toEqual(['19771023 23:12:00']);
    })

    it('should use timeFormat if two dates are during the same day', function () {
      var dates = [new Date("October 23, 1977 23:12:00"), new Date("October 23, 1977 23:40:01")];
      expect(filter(dates, 'yyyyMMdd H:mm:ss', 'H:mm:ss')).toEqual(['19771023 23:12:00', '23:40:01']);
    })
  });

  describe('trimFilter', function () {
    var filter, input;
    beforeEach(function () {
      input = "The rain in Spain falls";
      inject(function (_trimFilter_) {
        filter = _trimFilter_;
      });
    });

    it('should ignore input unless it is a string', function () {
      var input = ['a', 'b'];
      expect(filter(input, 1)).toEqual(input);
    })

    it('should ignore input if limit is less than zero', function () {
      expect(filter(input, -1)).toEqual(input);
    })

    it('should ignore input if limit is zero', function () {
      expect(filter(input, 0)).toEqual(input);
    })

    it('should return the original string if it is shorter than the limit', function () {
      expect(filter(input, 24)).toEqual(input);
    });

    it('should return the original string if it is equal to the limit', function () {
      expect(filter(input, 23)).toEqual(input);
    });

    it('should return an elipse if it is less than the limit', function () {
      expect(filter(input, 22)).toEqual('The rain in Spain f...');
    })
  })

  describe('durationFilter', function () {
    var filter, input;
    beforeEach(function () {
      input = "";
      inject(function (_durationFilter_) {
        filter = _durationFilter_;
      });
    });

    it('should ignore input unless it is a number', function () {
      var input = ['a', 'b'];
      expect(filter(input)).toEqual(input);
    })

    it('should return hours and mins if duration greather than an hour', function () {
      expect(filter(8460001)).toEqual('2hrs 21mins');
    })

    it('should return mins if greater than 1 min', function () {
      expect(filter(3360000)).toEqual('56mins');
    })

    it('should return secs if greater than 1 sec', function () {
      expect(filter(1000)).toEqual('1secs');
    })

    it('should return ms if less than 1sec', function () {
      expect(filter(999)).toEqual('999ms');
    })

  })

});
