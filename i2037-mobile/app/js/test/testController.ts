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
  }.bind(this));

  var mouseups:Rx.Observable<any> = rx.Observable.create(function (observer) {
    this.onMouseup = function ($event) {
      observer.onNext($event);
    }
  }.bind(this));

  clicks
    .buffer(clicks.debounce(500))
    .do(function(list) {
      console.log("list: ", list);
    })
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
}