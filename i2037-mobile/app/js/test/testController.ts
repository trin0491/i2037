/**
 * Created by richard on 10/09/2015.
 */
///<reference path="../../../typings/tsd.d.ts" />
///<reference path="../../../www/lib/rxjs/ts/rx.all.d.ts" />
export = testController;

testController.$inject = ['rx'];

function testController(rx) {
  var clicks:Rx.Observable<any> = rx.Observable.create(function (observer) {
    this.onClick = function (event) {
      observer.onNext(event);
    }
  }.bind(this)).publish().refCount();

  var mousedowns:Rx.Observable<any> = rx.Observable.create(function (observer) {
    this.onMousedown = function ($event) {
      observer.onNext($event);
    }
  }.bind(this)).publish().refCount();

  var mouseups:Rx.Observable<any> = rx.Observable.create(function (observer) {
    this.onMouseup = function ($event) {
      observer.onNext($event);
    }
  }.bind(this)).publish().refCount();

  clicks
    .timestamp()
    .do((x) => { console.log("Start gesture: ", x)})
    .buffer(clicks.debounce(500))
    .do((x) => { console.log("End gesture: ", x); })
    .map(function (list) {
      return list.length;
    })
    .filter(function (n) {
      return n >= 2;
    })
    .subscribe(function(e) {
      console.log("Double click", e);
    })
  ;

  var endgesture = mouseups.timestamp();

  var gestures = mousedowns.timestamp()
    .join(
      endgesture,
      function () {
        return rx.Observable.timer(300);
      },
      function () {
        return rx.Observable.timer(0);
      },
      function (up, down) {
        return {mousedown: down.timestamp, mouseup: up.timestamp}
      }
    )
    .do((x) => {
      console.log('Gesture: ', x)
    });

  gestures.timeInterval()
    .filter((x) => {
      return x.interval < 500;
    })
    .subscribe(function (e) {
      console.log("Double click", e);
    });

  //gestures.subscribe(function (e) {
  //  console.log("subscriber1: ", e);
  //})
  //
  //gestures.subscribe(function (e) {
  //  console.log("subscriber2: ", e);
  //})

  //gestures
  //  .join(
  //    gestures,
  //    function() { return rx.Observable.timer(300); },
  //    function() { return rx.Observable.timer(0); },
  //    function (one, two) {
  //      return two.mouseup - one.mouseup;
  //    }
  //  )
  //  .map(function (gesture) {
  //    return gesture.length;
  //  })
  //  .filter(function (n) {
  //    return n >= 2;
  //  })
  //  .subscribe(function (e) {
  //    console.log("Double click", e);
  //  })
}