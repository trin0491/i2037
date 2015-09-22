/**
 * Created by richard on 04/09/2015.
 */
///<reference path="../../../typings/tsd.d.ts" />
///<reference path="../../../www/lib/rxjs/ts/rx.all.d.ts" />

describe("Reactive JS", function () {

  xit("should be defined", function () {

    expect(Rx.Observable).toBeDefined();

    var obs = Rx.Observable.range(1, 3);
    var source = obs.let(function (o) {
      return o.concat(o);
    });

    var subscription = source.subscribe(
      function (x) {
        console.log(x)
      },
      function (err) {
        console.log(err)
      },
      function () {
        console.log()
      }
    )
  })

  it('should throttle', function () {
    var times = [
      {value: 0, time: 100},
      {value: 1, time: 600},
      {value: 2, time: 350},
      {value: 3, time: 900},
      {value: 4, time: 200},
      {value: 5, time: 150}
    ];

    var times2 = [
      {value: 0, time: 350},
      {value: 1, time: 400},
      {value: 2, time: 600},
      {value: 3, time: 900},
      {value: 4, time: 1300},
      {value: 5, time: 1600},
    ];

    var source = Rx.Observable.from(times2)
      .flatMap(function (item) {
        return Rx.Observable
          .of(item.value)
          .delay(item.time);
      })
      .debounce(300);

    //var subscription = source.subscribe(
    //  function (x) {
    //    console.log('Next: %s', x);
    //  },
    //  function (err) {
    //    console.log('Error: %s', err);
    //  },
    //  function () {
    //    console.log('Done');
    //  }
    //)

    source
      .timeInterval()
      .subscribe(function(x) {
        console.log("value: %s time: %s", x.value, x.interval)
      });
  })
})
