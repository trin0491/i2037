  function RefData(ccyPairCache) {
    this.cache = ccyPairCache;
  }
  function getExponent(dp) {
    var exp = Math.log(dp) / Math.log(10);        
    return Math.round(exp);
  }
  RefData.prototype = {
    getCcyPair: function(ccyCode) {
      return this.cache.get(ccyCode);
    },
    getPipsExponent: function(ccyCode) {
      var ccyPair = this.getCcyPair(ccyCode);
      return getExponent(ccyPair.pipsPrecision);
    },
    getMinIncrExponent: function(ccyCode) {
      var ccyPair = this.getCcyPair(ccyCode);
      return getExponent(ccyPair.minIncrement);
    }
  };

export default angular.module('i2037.fx.services.refData', [])

  .factory('ccyPairCache', ['$cacheFactory', function ccyPairCacheFactory($cacheFactory) {

    // TODO the cache that will be populated by a service
    var ccyPairs = $cacheFactory('ccyPairs');

    ccyPairs.put('EURUSD', {
      ccyPair: 'EURUSD',
      pipsPrecision: 0.0001,
      minIncrement: 0.00001
    });

    return ccyPairs;    
  }])

  .service('refData', ['ccyPairCache', RefData]);

