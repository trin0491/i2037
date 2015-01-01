describe('i2037.fx.services.pricing', function() {
  beforeEach(module('i2037.fx.services.pricing'));

  describe('PricingFacade', function() {
    var PricingFacade;

    beforeEach(function() {  
      inject(function(_PricingFacade_) {
       PricingFacade = _PricingFacade_;
      });
    });

    it('should be injected', function() {
      expect(PricingFacade).toBeDefined();
    });
  });

  describe('Ladder', function() {
    var Ladder;

    beforeEach(function() {
      inject(function(_Ladder_) {
        Ladder = _Ladder_;
      });
    });

    it('should be a constructor', function() {
      var ladder = new Ladder();      
      expect(ladder).toBeDefined();
      expect(ladder.rungs).toBeDefined();
    });
  });

  describe('VwapPx', function() {
    var vwap, VwapPx;

    beforeEach(function() {
      inject(function(_VwapPx_) {
        VwapPx = _VwapPx_;
      });
      mockLadder = {rungs:[]};
      vwap = new VwapPx('EURUSD', 4500000);      
    });

    it('should be injected', function() {
      expect(VwapPx).toBeDefined();
    })

    it('should be a constructor', function() {
      expect(vwap).toBeDefined();
    })

    it('should create a PM even with no rungs', function() {
      var px = vwap.pm
      expect(px).toBeDefined();
      expect(px.raw).toBe(null);
      expect(px.amt).toBe(4500000);
    })

    it('should calculate vwap with 1 rung', function() {
      mockLadder.rungs = [
        {px:1.32645,amt:4500000},
      ];
      var px = vwap.pm;
      vwap.update(mockLadder);
      expect(px.raw).toEqual(1.32645);
      expect(px.amt).toEqual(4500000);
    })

    it('should calculate vwap across 2 rungs', function() {
      mockLadder.rungs = [
        {px:1.32644,amt:1000000},      
        {px:1.32645,amt:3500000}
      ];
      var px = vwap.pm;
      vwap.update(mockLadder);
      expect(px.raw).toEqual(1.3264477777777777);
      expect(px.amt).toEqual(4500000);      
    })

    it('should calculate vwap across a partial rung', function() {
      mockLadder.rungs = [
        {px:1.32644,amt:1000000},      
        {px:1.32645,amt:5000000}
      ];
      var px = vwap.pm;
      vwap.update(mockLadder);
      expect(px.raw).toEqual(1.3264477777777777);
      expect(px.amt).toEqual(4500000);
    })

    it('should have no price if there is insufficient qty', function() {
      mockLadder.rungs = [
        {px:1.32644,amt:1000000},      
        {px:1.32645,amt:1000000},
        {px:1.32646,amt:1000000},        
      ];
      var px = vwap.pm;
      vwap.update(mockLadder);
      expect(px.raw).toEqual(null);
      expect(px.amt).toEqual(4500000);
    })

  });

  describe('AggregatedOrderBook', function() {
    var ob, AggregatedOrderBook, mockLadder;
    var LEVELS = 5;
    beforeEach(function() {
      inject(function(_AggregatedOrderBook_) {
        AggregatedOrderBook = _AggregatedOrderBook_;
      });
      mockLadder = {rungs:[]};
      ob = new AggregatedOrderBook(LEVELS);      
    });

    function expectRungs(pm, n) {
      expect(pm.rungs.length).toEqual(LEVELS);
      for (var i=n;i<pm.rungs.length;++i) {
        expect(pm.rungs[i].px.raw).toBeNull();
        expect(pm.rungs[i].totalAmt).toEqual(0);
        expect(pm.rungs[i].amts.length).toEqual(0);        
        expect(pm.rungs[i].srcs.length).toEqual(0);                
      }            
    }

    function expectRung(pm, n, expectedRung) {
      var rung = pm.rungs[n];
      expect(rung.px.raw).toEqual(expectedRung.px);
      expect(rung.amts.length).toEqual(expectedRung.amts.length);
      var expectedTotal = 0;
      for (var i=0;i<expectedRung.amts.length;++i) {
        expectedTotal += expectedRung.amts[i];
        expect(rung.amts[i]).toEqual(expectedRung.amts[i]);
      }
      expect(rung.totalAmt).toEqual(expectedTotal);
      expect(rung.srcs.length).toEqual(expectedRung.srcs.length);
      for (var i=0;i<expectedRung.amts.length;++i) {
        expect(rung.srcs[i]).toEqual(expectedRung.srcs[i]);
      }
    }

    it('should be defined', function() {
      expect(AggregatedOrderBook).toBeDefined();
    })

    it('should be a constructor', function() {
      expect(ob).toBeDefined();
    })

    it('should eagearly create a PM with n levels', function() {
      var pm = ob.pm;
      expect(pm).toBeDefined();
      expect(pm.rungs.length).toEqual(LEVELS);
    })

    it('should have n levels even if ladder has no rungs', function() {
      mockLadder.rungs = [];
      ob.update(mockLadder);
      var pm = ob.pm;
      expect(pm.rungs.length).toEqual(LEVELS);
      expect(pm.maxAmt).toEqual(0);
    })

    it('should have one populated rung if there is only one order', function() {
      mockLadder.rungs = [{px:1.32645,amt:1000000,src:'MSMM'}];
      ob.update(mockLadder);
      var pm = ob.pm;
      expectRungs(pm, 1);
      expectRung(pm, 0, {px: 1.32645, amts:[1000000], srcs:['MSMM']});
      expect(pm.maxAmt).toEqual(1000000);
    })

    it('should have one populated rung with two orders at the same price', function() {
      mockLadder.rungs = [
        {px:1.32645,amt:1000000,src:'MSMM'},
        {px:1.32645,amt:5000000,src:'MSP1'}        
      ];
      ob.update(mockLadder);
      var pm = ob.pm;
      expectRungs(pm, 1);
      expectRung(pm, 0, {px: 1.32645, amts:[1000000,5000000], srcs:['MSMM','MSP1']});
      expect(pm.maxAmt).toEqual(6000000);
    })

    it('should have two populated rungs with two orders at different prices', function() {
      mockLadder.rungs = [
        {px:1.32645,amt:1000000,src:'MSMM'},
        {px:1.32646,amt:5000000,src:'MSP1'}        
      ];
      ob.update(mockLadder);
      var pm = ob.pm;
      expectRungs(pm, 2);
      expectRung(pm, 0, {px: 1.32645, amts:[1000000], srcs:['MSMM']});
      expectRung(pm, 1, {px: 1.32646, amts:[5000000], srcs:['MSP1']});
      expect(pm.maxAmt).toEqual(5000000);                
    })

    it('should only populate max depth rungs even if there are more orders', function() {
      mockLadder.rungs = [
        {px:1.32645,amt:10,src:'1'},
        {px:1.32644,amt:10,src:'1'},
        {px:1.32644,amt:10,src:'1'},
        {px:1.32643,amt:10,src:'1'},
        {px:1.32642,amt:10,src:'1'},
        {px:1.32641,amt:10,src:'1'},        
        {px:1.32640,amt:10,src:'1'},                
      ];
      ob.update(mockLadder);
      var pm = ob.pm;
      expectRungs(pm, 5);
      expectRung(pm, 0, {px: 1.32645, amts:[10], srcs:['1']});
      expectRung(pm, 1, {px: 1.32644, amts:[10,10], srcs:['1','1']});                        
      expectRung(pm, 2, {px: 1.32643, amts:[10], srcs:['1']});                        
      expectRung(pm, 3, {px: 1.32642, amts:[10], srcs:['1']});                        
      expectRung(pm, 4, {px: 1.32641, amts:[10], srcs:['1']});
      expect(pm.maxAmt).toEqual(20);                       
    })

    it('should update the pm', function() {
      mockLadder.rungs = [
        {px:1.32645,amt:1000000,src:'MSMM'},
        {px:1.32645,amt:5000000,src:'MSP1'}        
      ];
      ob.update(mockLadder);
      var pm = ob.pm;
      expectRungs(pm, 1);
      expectRung(pm, 0, {px: 1.32645, amts:[1000000,5000000], srcs:['MSMM','MSP1']});
      expect(pm.maxAmt).toEqual(6000000);

      mockLadder.rungs = [
        {px:1.32645,amt:1000000,src:'MSMM'},
        {px:1.32646,amt:5000000,src:'MSP1'},
        {px:1.32646,amt:1000000,src:'MSMM'}                        
      ];
      ob.update(mockLadder);
      expectRungs(pm, 2);
      expectRung(pm, 0, {px: 1.32645, amts:[1000000], srcs:['MSMM']});
      expectRung(pm, 1, {px: 1.32646, amts:[5000000, 1000000], srcs:['MSP1', 'MSMM']});
      expect(pm.maxAmt).toEqual(6000000);                
    });
  });

  describe('Price', function() {
    var Price, mockRefData;

    beforeEach(function() {

      mockRefData = jasmine.createSpyObj('refData', ['getPipsExponent', 'getMinIncrExponent']);
      mockRefData.getPipsExponent.andReturn(-4);
      mockRefData.getMinIncrExponent.andReturn(-5);

      module(function($provide) {
        $provide.value('refData', mockRefData);
      });

      inject(function(_Price_) {
        Price = _Price_;
      });
    });

    it('should be injected', function() {
      expect(Price).toBeDefined();
    })

    it('should provide a toString', function() {
      var px = new Price('EURUSD');
      expect(px.toString()).toBeNull();

      px.raw = 1.326,
      expect(px.toString()).toEqual('1.32600');

      px.raw = 1.32645;
      expect(px.toString()).toEqual('1.32645');      

      px.raw = 1.326456;
      expect(px.toString()).toEqual('1.32646');            
    })

    it('should return prefix, pips and decimals as strings', function() {
      var px = new Price('EURUSD');
      px.raw = 1.32645;
      expect(px.getPrefix()).toBe('1.32');      
      expect(px.getPips()).toBe('64');
      expect(px.getDecimals()).toBe('5');      
    })

    it('should return null for prefix, pips and decimals, if there is no price', function() {
      var px = new Price('EURUSD');
      px.raw = null;
      expect(px.getPrefix()).toBe(null);           
      expect(px.getPips()).toBe(null);
      expect(px.getDecimals()).toBe(null);            
    })

    it('should pad decimals with 0 if there are insufficient digits', function() {
      var px = new Price('EURUSD');
      px.raw = 1.326;
      expect(px.getPrefix()).toBe('1.32');      
      expect(px.getPips()).toBe('60');
      expect(px.getDecimals()).toBe('0');            
    });

    it('should return empty string if there are not decimals', function() {
      mockRefData.getPipsExponent.andReturn(-4);
      mockRefData.getMinIncrExponent.andReturn(-4);
      var px = new Price('EURUSD');
      px.raw = 1.3264;
      expect(px.getPrefix()).toBe('1.32');      
      expect(px.getPips()).toBe('64');
      expect(px.getDecimals()).toBe('');            
    })
  });
});
