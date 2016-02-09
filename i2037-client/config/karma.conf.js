module.exports = function (config) {
  config.set({
    basePath: '../build',

    files: [
      'app/lib/system.js',
      'app/lib/jquery.js',
      'app/lib/angular.js',
      'app/lib/bootstrap.js',
      'app/lib/deps.js',
      '../bower_components/angular-mocks/angular-mocks.js',
      '../node_modules/systemjs/dist/system.src.js',
      '../node_modules/es6-shim/es6-shim.js',
      '../node_modules/es6-promise/dist/es6-promise.js',
      '../node_modules/angular2/bundles/angular2-polyfills.js',
      '../node_modules/angular2/bundles/angular2.dev.js',
      '../node_modules/angular2/bundles/upgrade.dev.js',
      '../node_modules/angular2/bundles/testing.dev.js',
      '../node_modules/rxjs/bundles/Rx.js',
      'https://maps.googleapis.com/maps/api/js?key=AIzaSyD1XkZF2vEwPUZeFfadDMe76ozKhrk-mXE',
      'app/js/templates/i2037-client.tpl.js',
      {pattern: 'app/js/**/*.js', included: false},
      {pattern: 'app/js/**/*.ts', included: false},
      {pattern: 'app/js/**/*.js.map', included: false},
      {pattern: 'test/unit/**/*.spec.js', included: false},
      {pattern: 'test/unit/**/*.spec.ts', included: false},
      {pattern: 'test/unit/**/*.spec.js.map', included: false},
      {pattern: 'app/js/**/*.html', included: false, watched: true},
      'test/unit/test-main.js'
    ],

    autoWatch: true,

    frameworks: ['jasmine'],

    browsers: ['Chrome'],

    plugins: [
      'karma-junit-reporter',
      'karma-chrome-launcher',
      'karma-jasmine'
    ],

    proxies: {
      // required for component assests fetched by Angular's compiler
      "/js": "/base/app/js"
    },

    junitReporter: {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

  })
};