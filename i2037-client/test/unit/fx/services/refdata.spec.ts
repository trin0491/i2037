import refDataServices from "../../../../app/js/fx/services/refdata";

describe('i2037.fx.services.refData', function () {
  beforeEach(module(refDataServices.name));

  describe('refData', function () {
    var refData;

    beforeEach(function () {
      inject(function (_refData_) {
        refData = _refData_;
      });
    });

    it('should be injected', function () {
      expect(refData).toBeDefined();
    });

    it('should return ccyPair objects with a minIncrement', function () {
      var ccyPair = refData.getCcyPair('EURUSD');
      expect(ccyPair.minIncrement).toEqual(0.00001);
    });

    it('should return ccyPair objects with a pipPrecision', function () {
      var ccyPair = refData.getCcyPair('EURUSD');
      expect(ccyPair.pipsPrecision).toEqual(0.0001);
    });

    it('should provide the base 10 exponent for pips', function () {
      var i = refData.getPipsExponent('EURUSD');
      expect(i).toEqual(-4);
    });

    it('should provide the base 10 exponent for minIncrement', function () {
      var i = refData.getMinIncrExponent('EURUSD');
      expect(i).toEqual(-5);
    });
  });
});
