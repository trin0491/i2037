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
    "rx": "http://cdnjs.cloudflare.com/ajax/libs/rxjs/3.1.2/rx",
    "rx.time": "http://cdnjs.cloudflare.com/ajax/libs/rxjs/3.1.2/rx.time",
    "rx.experimental": "http://cdnjs.cloudflare.com/ajax/libs/rxjs/3.1.2/rx.experimental"
  },

  // ask Require.js to load these files (all our tests)
  deps: tests,

  // start test run, once Require.js is done
  callback: __karma__.start
});