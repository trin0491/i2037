module.exports = function(config){
    config.set({
    basePath : '../',

    files : [
      'app/lib/jquery/jquery-1.10.2.min.js',
      'app/lib/angular/angular.js',
      'app/lib/angular/angular-resource.js',
      'app/lib/angular/angular-route.js',      
      'test/lib/angular/angular-mocks.js',
      'https://maps.googleapis.com/maps/api/js?key=AIzaSyD1XkZF2vEwPUZeFfadDMe76ozKhrk-mXE&sensor=false',
    //  'app/js/**/*.js',
      'build/dev/js/dev/i2037-client.js',
      'test/unit/**/*.spec.js'
    //  'test/unit/**/*.js'
    ],

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['Chrome'],

    plugins : [
            'karma-junit-reporter',
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine'       
            ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

})}