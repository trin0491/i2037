angular.module('i2037.directives.spinner', [])

.directive("i2SpinShow", ['$window', function($window) {
  return function(scope, element, attrs){

    var spinner;

    function start(optsExpr) {
      if (!spinner) {
        var options = scope.$eval(optsExpr) || {};                        
        spinner = new $window.Spinner(options);
        spinner.spin(element[0]);        
      }
    }

    function stop() {
      if (spinner) {
        spinner.stop();
        spinner = null;
      }
    }

    scope.$watch(attrs.i2SpinShow , function(isLoading) {
      if (isLoading) {
        start(attrs.i2SpinOpts);
      } else {
        stop();
      }
    });

    scope.$watch(attrs.i2SpinOpts, function(options) {
      if (spinner) {
        stop();
        start(options);
      }
    });

    scope.$on('$destroy', function() {
      stop();
    });
  }
}])
;
