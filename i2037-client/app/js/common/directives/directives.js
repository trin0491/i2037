'use strict';

/* Directives */


angular.module('i2037.directives', []).
  directive('i2AppVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }])

.directive("i2Loading", function(){
	return function(scope, element, attrs){
		scope.$watch(function(){ return scope.$eval(attrs.btnLoading); }, function(loading){
			if(loading) {
				return element.button("loading");
			} else {
				element.button("reset");			
			}
		});
	}
})

;

