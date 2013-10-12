
describe('i2037.moves.filters', function() {
  beforeEach(function() {
    module('i2037.moves.filters');
  });

  describe('activity', function() {
    var activity;
    beforeEach(function() {
      inject(function(_activityFilter_) {
        activity = _activityFilter_;
      });
    });
    it('should deal with wlk', function() {
      expect(activity('wlk')).toEqual('Walking');
    });
  });
});