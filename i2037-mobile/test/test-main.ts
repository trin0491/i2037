/**
 * Created by richard on 10/09/2015.
 */
///<reference path="../typings/tsd.d.ts" />
var tests = [];

declare var __karma__:any;

for (var file in __karma__.files) {
  if (__karma__.files.hasOwnProperty(file)) {
    if (/spec\.js$/.test(file)) {
      tests.push(file);
    }
  }
}

requirejs.config({
  // Karma serves files from '/base'
  baseUrl: '/base',

  paths: {
    "angular": "www/lib/ionic/js/ionic.bundle",
    "rx": "www/lib/rxjs/dist/rx.lite",
    "rx.time": "www/lib/rxjs/dist/rx.time",
    "rx.experimental": "www/lib/rxjs/dist/rx.experimental",
    "rx.angular": "www/lib/rx-angular/dist/rx.angular"
  },

  // ask Require.js to load these files (all our tests)
  deps: tests,

  // start test run, once Require.js is done
  callback: __karma__.start
});
