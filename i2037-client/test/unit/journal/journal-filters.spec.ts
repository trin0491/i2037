import filters from "../../../app/js/journal/journal-filters";

describe('i2037.journal.filters', function () {
  beforeEach(function () {
    angular.mock.module(filters.name);
  });

  describe('movesActivity', function () {
    var activity;
    beforeEach(function () {
      inject(function (_movesActivityFilter_) {
        activity = _movesActivityFilter_;
      });
    });
    it('should deal with wlk', function () {
      expect(activity('wlk')).toEqual('Walking');
    });
  });
});