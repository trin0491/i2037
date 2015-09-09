/**
 * Created by richard on 04/09/2015.
 */
///<reference path="../../typings/tsd.d.ts" />

define(['rx', 'rx.time', 'rx.experimental'], function(Rx:any) {
  describe("Reactive JS", function () {

    it("should produce entries on a timed interval", function() {
      var source = Rx.Observable.interval(100).take(3);

      source.subscribe(
        function(x) { console.log(x) },
        function(err) { console.log(err) },
        function() {console.log("completed")}
      );

    });

    it("should be defined", function () {

      expect(Rx.Observable).toBeDefined();

      var obs = Rx.Observable.range(1, 3);
      var source = obs.let(function(o) { return o.concat(o); });

      var subscription = source.subscribe(
        function(x) { console.log(x) },
        function (err) { console.log(err) },
        function () { console.log() }
      )
    })

  })
})
