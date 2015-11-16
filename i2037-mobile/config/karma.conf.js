module.exports = function (config) {
  config.set({
    basePath: '../',

    files: [
      'www/lib/ionic/js/ionic.bundle.js',
      'www/lib/angular-mocks/angular-mocks.js',
      'www/lib/rxjs/dist/rx.all.js',
      'www/lib/rxjs/dist/rx.testing.js',
      'www/lib/rx-angular/dist/rx.angular.js',
      'www/lib/requirejs/require.js',
      'node_modules/karma-requirejs/lib/adapter.js',
      {pattern: 'www/lib/**/*.js', included: false},
      {pattern: 'www/js/**/*.js', included: false},
      {pattern: 'www/js/**/*.js.map', included: false},
      {pattern: 'www/js/**/*.ts', included: false},
      {pattern: 'test/unit/**/*.spec.js', included: false},
      {pattern: 'test/unit/**/*.spec.js.map', included: false},
      {pattern: 'test/unit/**/*.spec.ts', included: false},
      'test/test-main.js'
    ],

    exclude: [
      'www/js/main.js'
    ],

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    autoWatch: true,

    frameworks: ['jasmine'],

    browsers: ['Chrome'],

  })
};