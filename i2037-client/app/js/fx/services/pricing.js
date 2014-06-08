(function() {
  'use strict';

  function Rung(data) {
    angular.extend(this, data);
    Object.defineProperty(this, 'cumQty', {
      get: function() { 
        return this.amts.reduce(function(a,b) {
          return a+b;
        });
      }
    });
  }

  function OrderBook(params) {
    var _state = 'PENDING';

    angular.extend(this, params);

    this.getId = function() {
      return this.ccyPair + ':' + this.tenor;
    };

    this.setState = function(state) {
      _state = state;
    };
  }

  function testUpdate(count,ob) {
    var i = count % ob.sell.length;
    var m = (Math.random() > 0.5) ? 1 : -1;
    var amt = ob.sell[i].amts[0];
    amt += m;
    amt = Math.max(0, amt);
    ob.sell[i].amts[0] = amt;
  }

  angular.module('i2037.fx.services.pricing', [])

  .factory('PricingFacade', ['$q', '$interval', function($q, $interval) {

    var priceStreams = {};

    function PricingFacade() {

      this.getOrderBook = function(config) {
        var deferred = $q.defer();
        var ob = new OrderBook(config);
        priceStreams[ob.getId()] = ob;

        $interval(function() {
          ob.setState('STREAMING');

          ob.buy = [
            new Rung({ px: 65.1, amts: [1,1]}),
            new Rung({ px: 65.2, amts: [2,3]}),
            new Rung({ px: 66,   amts: [3,3,4]}),    
            new Rung({ px: 65,   amts: [4,4,4]}),    
            new Rung({ px: 64,   amts: [4,5,5]})          
          ];
          ob.sell = [
            new Rung({ px: 65.1, amts: [2,3]}),
            new Rung({ px: 65.2, amts: [3,2]}),
            new Rung({ px: 66,   amts: [2,2]}),
            new Rung({ px: 67,   amts: [5,2,3]}),
            new Rung({ px: 68,   amts: [5,4,1]})                        
          ];

          deferred.resolve(ob);

          var i = 0;
          $interval(function() {
            testUpdate(++i,ob);
          }, 200, 50);
        }, 500, 1);

        return deferred.promise;
      };
    }

    return new PricingFacade();  
  }]);

}());
