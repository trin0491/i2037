module.exports = function(config){
    config.set({
    basePath : '../',

    files : [
      'build/app/lib/jquery.js',
      'build/app/lib/angular.js',
      'build/app/lib/bootstrap.js',
      'build/app/lib/deps.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'https://maps.googleapis.com/maps/api/js?key=AIzaSyD1XkZF2vEwPUZeFfadDMe76ozKhrk-mXE&sensor=false',
      'build/app/js/**/*.js',
      'build/test/unit/**/*.spec.js'
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