(function() {
  'use strict';

  function Rung(data) {
    angular.extend(this, data);
    Object.defineProperty(this, 'totalAmt', {
      get: function() { 
        return this.amts.reduce(function(a,b) {
          return a+b;
        });
      }
    });
  }

  function getKey(data) {
    return data.ccyPair + ':' + data.tenor;
  }

  function OrderBook(params) {
    var _state = 'PENDING';

    angular.extend(this, params);

    this.setState = function(state) {
      _state = state;
    };
  }

  function testUpdate(count,ladder) {
    var i = count % ladder.length;
    var m = (Math.random() > 0.5) ? 1 : -1;
    var amt = ladder[i].amts[0];
    amt += m;
    amt = Math.max(0, amt);
    ladder[i].amts[0] = amt;
  }

  angular.module('i2037.fx.services.pricing', [])

  .factory('PricingFacade', ['$q', '$interval', '$cacheFactory', function($q, $interval, $cacheFactory) {

    var priceStreams = $cacheFactory('priceStreams');

    function PricingFacade() {
      this.getOrderBook = function(config) {
        var deferred = $q.defer();
        var key = getKey(config);
        var ob = priceStreams.get(key);
        if (ob) {
          deferred.resolve(ob);
        } else {
          ob = new OrderBook(config);
          priceStreams.put(key, ob);          
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
              testUpdate(i,ob.buy);
              testUpdate(i,ob.sell);
              ++i;            
            }, 100, 50);
          }, 500, 1);
        }
        return deferred.promise;
      };

      this.getCumlativeAmt = function(config, level) {

        function CumulativeAmt(ladder, level) {
          this.ladder = ladder;
          this.defineProperty(this, 'value', {
            get value() { 
              var cumAmt = 0;
              for (var i=0;i < level && i < this.ladder.length;++i) {
                cumAmt += ladder[i].totalAmt;
              }
              return cumAmt;
            }
          });          
        }

        return this.getOrderBook(config).then(function(ob) {
          var ladder = (side === 1) ? ob.buy : ob.sell;
          return new CumulativeAmt(ladder, level);
        });
      };
    }

    return new PricingFacade();  
  }]);

}());
