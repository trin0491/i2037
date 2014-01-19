
describe('i2037.journal.filters', function() {
  beforeEach(function() {
    module('i2037.journal.filters');
  });

  describe('movesActivity', function() {
    var activity;
    beforeEach(function() {
      inject(function(_movesActivityFilter_) {
        activity = _movesActivityFilter_;
      });
    });
    it('should deal with wlk', function() {
      expect(activity('wlk')).toEqual('Walking');
    });
  });
});