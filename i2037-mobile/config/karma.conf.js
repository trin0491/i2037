module.exports = function (config) {
  config.set({
    basePath: '../',

    files: [
      "https://cdnjs.cloudflare.com/ajax/libs/rxjs/3.1.2/rx.all.min.js",
      'test/**/*.spec.js'
    ],

    autoWatch: true,

    frameworks: ['jasmine'],

    browsers: ['Chrome'],

    plugins: [
      'Karma-junit-reporter',
      'Karma-chrome-launcher',
      'Karma-jasmine'
    ],

    junitReporter: {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

  })
}