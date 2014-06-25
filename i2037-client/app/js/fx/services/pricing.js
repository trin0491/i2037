(function() {
  'use strict';

  function testUpdate(count,ladder) {
    var i = count % ladder.rungs.length;
    var m = (Math.random() > 0.5) ? 1 : -1;
    var amt = ladder.rungs[i].amt;
    amt += m;
    amt = Math.max(0, amt);
    ladder.rungs[i].amt = amt;
    ladder.raiseUpdate();
  }

  angular.module('i2037.fx.services.pricing', ['i2037.fx.services.refData'])

  .factory('VwapPx', ['Price', function vwapPxFactory(Price) {
    function VwapPM(ccyPair, amt) {
      Price.call(this, ccyPair);
      this.amt = amt;
    }
    VwapPM.prototype = Object.create(Price.prototype);
    VwapPM.prototype.constructor = VwapPM;

    function VwapPx(ccyPair, amt) {
      this.pm = this.create(ccyPair, amt);
    }
    VwapPx.prototype = {
      create: function(ccyPair, amt) {
        return new VwapPM(ccyPair, amt);
      },
      update: function(ladder) {
        this._update(ladder, this.pm, this.pm.amt);
      },
      _update: function(ladder, pm, amt) {
        var sum = 0;
        var totalAmt = 0;
        var rungs = ladder.rungs;
        for (var i=0; i < rungs.length; ++i) {
          var rungAmt = rungs[i].amt;
          var remaining = amt - totalAmt;
          if (remaining > rungAmt) {
            sum += rungAmt * rungs[i].px;
            totalAmt += rungAmt;
          } else {
            sum += remaining * rungs[i].px;
            totalAmt += remaining;
            break;
          }
        }
        if (totalAmt < amt || totalAmt === 0) {
          pm.raw = null;        
        } else {
          pm.raw = sum / totalAmt;        
        }
        pm.amt = amt;
        return pm;
      }
    };

    return VwapPx;
  }])

  .factory('AggregatedOrderBook', ['Price', function aggregatedOrderBookFactory(Price) {

    function AggregatedRung(ccyPair) {
      this.px = new Price(ccyPair);
      this.totalAmt = 0;      
      this.amts = [];
      this.srcs = [];
    }

    function AggregatedOrderBook(ccyPair, maxDepth) {
      this.maxDepth = maxDepth || 5;
      this.pm = this.create(ccyPair);
    }
    AggregatedOrderBook.prototype = {
      create: function(ccyPair) {
        var pm = { rungs: [], maxAmt:0 };
        for (var i=0;i<this.maxDepth;i++) {
          pm.rungs[i] = new AggregatedRung(ccyPair);
        }
        return pm;
      },
      update: function(ladder) {
        this._update(ladder, this.pm, this.maxDepth);
      },
      _update: function(ladder, pm, maxDepth) {
        var d = -1;
        var lastPx;
        var rungs = ladder.rungs;
        var pmRungs = pm.rungs;
        for (var i=0; i < rungs.length; ++i) {
          if (rungs[i].px !== lastPx) {
            if (++d >= maxDepth) {
              break;
            }            
            lastPx = rungs[i].px;
            pmRungs[d].px.raw = lastPx;
            pmRungs[d].amts = [rungs[i].amt];
            pmRungs[d].srcs = [rungs[i].src];                    
          } else {
            pmRungs[d].amts.push(rungs[i].amt);
            pmRungs[d].srcs.push(rungs[i].src);                              
          }
        }

        function sum(a, b) {
          return a+b;
        }
        var maxAmt = 0;      
        pmRungs.forEach(function(rung) {
          rung.totalAmt = rung.amts.reduce(sum, 0);
          if (rung.totalAmt > maxAmt) {
            maxAmt = rung.totalAmt;
          }
        });
        pm.maxAmt = maxAmt;
      }
    };

    return AggregatedOrderBook;    
  }])

  .factory('Ladder', [function ladderFactory() {
    function Ladder(rungs) {
      this.observers = [];
      this.rungs = rungs || [];

      var _state = 'PENDING';      
      this.setState = function(state) {
        _state = state;
      };
    }
    Ladder.prototype = {
      addObserver: function(observer) {
        return this.observers.push(observer);
      },
      removeObserver: function(observer) {
        this.observers.splice(this.observers.indexOf(observer), 1);
      },
      raiseUpdate: function() {
        var ladder = this;
        this.observers.forEach(function(observer) {
          observer.update(ladder);
        });
      }
    };
    return Ladder;
  }])

  .factory('Price', ['refData', function PriceFactory(refData) {

    function Price(ccyPair) {
      this.ccyPair = ccyPair;
      var _raw = null;
      Object.defineProperty(this, 'raw', {
        get: function() { 
          return _raw;
        },
        set: function(value) {
          _raw = value;
        }            
      });
    }
    Price.prototype = {
      _getPipsIndex: function(str) {
        var e = this.refData.getPipsExponent(this.ccyPair);
        var d = str.indexOf(".");
        if (d < 0) {
          d = str.length - 1;
        }
        var i = d - e - 1;
        return i;
      },
      toString: function() {
        return this.toFixed();
      },
      getPrefix: function() {
        var str = this.toFixed();
        if (str === null) {
          return null;
        }
        var l = this._getPipsIndex(str);
        return str.substr(0, l);        
      },
      getPips: function() {
        var str = this.toFixed();
        if (str === null) {
          return null;
        }
        var i = this._getPipsIndex(str);
        return str.substr(i, 2);
      },
      getDecimals: function() {
        var str = this.toFixed();
        if (str === null) {
          return null;
        }
        var i = this._getPipsIndex(str) + 2;
        return str.substr(i);
      },
      toFixed: function() {
        var raw = this.raw;
        if (raw !== null) {
          // TODO this needs to do rounding properly, e.g. banks favour
          var dp = this.refData.getMinIncrExponent(this.ccyPair);
          return this.raw.toFixed(Math.abs(dp));
        } else {
          return null;
        }
      },
      refData: refData // TODO
    };    
    
    return Price;
  }])

  .factory('PricingFacade', ['$interval', 
    '$cacheFactory', 
    'AggregatedOrderBook', 
    'VwapPx',
    'Ladder', 
    function PricingFacadeFactory($interval, $cacheFactory, AggregatedOrderBook, VwapPx, Ladder) {

    var priceStreams = $cacheFactory('priceStreams');

    function getKey(config, side) {
      return config.ccyPair + ':'+ side + ':' + config.tenor;
    }

    function getLadder(config, side) {
      var key = getKey(config, side);
      var ladder = priceStreams.get(key);
      if (!ladder) {
        ladder = new Ladder(config);

        if (side === 1) {          
          ladder.rungs = [
            {px:1.32651, amt:2, src:'EXT'},
            {px:1.32651, amt:1, src:'MSMM'},            
            {px:1.32652, amt:3, src:'EXT'},
            {px:1.3266,  amt:2, src:'EXT'},
            {px:1.3266,  amt:3, src:'MSMM'},                        
            {px:1.3267,  amt:5, src:'EXT'},
            {px:1.3268,  amt:5, src:'EXT'},
            {px:1.3268,  amt:5, src:'MSMM'},
            {px:1.3268,  amt:4, src:'MSP1'}
          ];          
        } else {
          ladder.rungs = [
            {px:1.32642, amt:1, src:'EXT'},
            {px:1.32641, amt:2, src:'EXT'},
            {px:1.32641, amt:1, src:'MSMM'},            
            {px:1.3263,  amt:3, src:'EXT'},    
            {px:1.3262,  amt:4, src:'EXT'},
            {px:1.3262,  amt:3, src:'MSMM'},                    
            {px:1.3261,  amt:4, src:'EXT'},
            {px:1.3261,  amt:5, src:'MSMM'},
            {px:1.3261,  amt:5, src:'MSP1'},                                                                            
          ];
        }        
        priceStreams.put(key, ladder);          
        $interval(function() {
          ladder.setState('STREAMING');
          var i = 0;
          $interval(function() {
            testUpdate(++i,ladder);
          }, 100, 50);
        }, 500, 1);
      }
      return ladder;      
    }

    function PricingFacade() {
      this.getOrderBook = function(config, side) {
        var ladder = getLadder(config, side);
        var ob = new AggregatedOrderBook(config.ccyPair);
        ladder.addObserver(ob);
        return ob.pm;
      };

      this.getVwap = function(config, side, amt) {
        var ladder = getLadder(config, side);
        var px = new VwapPx(config.ccyPair, amt);
        ladder.addObserver(px);
        return px.pm;
      };
    }

    return new PricingFacade();  
  }]);

}());
