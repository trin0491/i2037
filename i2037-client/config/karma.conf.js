module.exports = function(config){
    config.set({
    basePath : '../',

    files : [
      'build/dev/js/jquery.js',
      'build/dev/js/angular.js',
      'build/dev/js/bootstrap.js',
      'build/dev/js/deps.js',      
      'bower_components/angular-mocks/angular-mocks.js',
      'https://maps.googleapis.com/maps/api/js?key=AIzaSyD1XkZF2vEwPUZeFfadDMe76ozKhrk-mXE&sensor=false',
      'app/js/**/*.js',
      'test/unit/**/*.spec.js',
      'build/tmp/templates/app.js'
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

})}