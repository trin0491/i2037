module.exports = function(config){
    config.set({
    basePath : '../',

    files : [
      'build/lib/jquery.js',
      'build/lib/angular.js',
      'build/lib/bootstrap.js',
      'build/lib/deps.js',      
      'bower_components/angular-mocks/angular-mocks.js',
      'https://maps.googleapis.com/maps/api/js?key=AIzaSyD1XkZF2vEwPUZeFfadDMe76ozKhrk-mXE&sensor=false',
      'app/js/**/*.js',
      'build/js/**/*.js',
      'build/js/templates/i2037-client.tpl.js',
      'test/unit/**/*.spec.js'
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