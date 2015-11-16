/**
 * Created by richard on 04/09/2015.
 */
///<reference path="../../../typings/tsd.d.ts" />
///<reference path="../../../www/lib/rxjs/ts/rx.lite.d.ts" />
///<reference path="../../../www/lib/rxjs/ts/rx.time.d.ts" />
///<reference path="../../../www/lib/rxjs/ts/rx.testing.d.ts" />

describe("Reactive JS", function () {
  var onNext = Rx.ReactiveTest.onNext;
  var onCompleted = Rx.ReactiveTest.onCompleted;
  var scheduler:Rx.TestScheduler;
  var mockCommand;

  beforeEach(function () {
    mockCommand = jasmine.createSpy('mockCommand');
    scheduler = new Rx.TestScheduler();
  });

  it('should throttle', function () {
    var times = [
      {value: 0, time: 350},
      {value: 1, time: 400},
      {value: 2, time: 600},
      {value: 3, time: 900},
      {value: 4, time: 1300},
      {value: 5, time: 1600},
    ];

    var source = Rx.Observable.from(times)
      .flatMap(function (item) {
        return Rx.Observable
          .of(item.value)
          .delay(item.time);
      })
      .debounce(300);

    source
      .timeInterval()
      .subscribe(function (x) {
        console.log("value: %s time: %s", x.value, x.interval)
      });
  });

  it('should work with the test scheduler', function () {
    var xs = scheduler.createHotObservable(
      onNext(250, 'a'),
      onCompleted(260)
    );

    var result = scheduler.startWithCreate(function () {
      return xs.map(function (x) {
        return x;
      });
    });

    expect(result.messages).toEqual([
      onNext(250, 'a'),
      onCompleted(260)
    ]);

  });

  it('should concatMap', function () {
    var xs = scheduler.createHotObservable(
      onNext(260, 'a')
    )
      .do(function () {
        console.log("do1");
      })
      .concatMap((x) => {
        return mockCommand(x);
      })
      .publish();

    mockCommand.and.callFake(function () {
      return scheduler.createResolvedPromise(350, 'a1')
    });

    var results = [];

    function log(x) {
      console.log("value: ", x);
    }

    xs.subscribe(log);
    xs.subscribe(log);
    results[0] = scheduler.startWithCreate(function () {
      return xs
    });


    expect(mockCommand).toHaveBeenCalled();
    results.forEach(function (result, i) {
      console.log("index: ", i);
      expect(result.messages).toEqual([
        onNext(350, 'a1'),
      ]);
    });
  })
});
