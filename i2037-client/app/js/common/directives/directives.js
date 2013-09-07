'use strict';

/* Directives */


angular.module('i2037.directives', []).
  directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }])

.directive("btnLoading", function(){
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

