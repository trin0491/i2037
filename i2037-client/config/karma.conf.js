module.exports = function(config){
    config.set({
    basePath : '../build',

    files : [
      'app/lib/jquery.js',
      'app/lib/angular.js',
      'app/lib/bootstrap.js',
      'app/lib/deps.js',
      '../bower_components/angular-mocks/angular-mocks.js',
      'https://maps.googleapis.com/maps/api/js?key=AIzaSyD1XkZF2vEwPUZeFfadDMe76ozKhrk-mXE&sensor=false',
      'app/js/templates/i2037-client.tpl.js',
      'app/lib/system.js',
      {pattern:'app/js/**/*.js', included:false},
      {pattern:'app/js/**/*.js.map', included:false},
      {pattern:'test/unit/**/*.spec.js', included:false},
      {pattern:'test/unit/**/*.spec.js.map', included:false},
      'test/unit/test-main.js'
    ],

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['Chrome'],

    plugins : [
            'karma-junit-reporter',
            'karma-chrome-launcher',
            'karma-jasmine'
            ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

})};