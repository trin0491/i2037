'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
//angular.module('myApp.services', []).
//  value('version', '0.1');

angular.module('i2037.services', ['ngResource'])

.value('version', '0.1')

.factory('Wine', function($resource) {
	return $resource('svc/wines/:wineId', 
		{ wineId: '@wineId' }, 
		{ query: {method:'GET', params:{}, isArray:true } }
	)
})  

.factory('Grape', function($resource) {
  	return $resource('svc/grapes', {}, {
  		query: {method:'GET', params:{}, isArray:true}
  	})
})

.factory('User', function($resource, $http) {
	var user = $resource('svc/session/user');

	user.login = function(userName, password) {
	    var loginParams = jQuery.param({
	      j_username: userName,
	      j_password: password
	    });		
	    return $http.post('j_spring_security_check', loginParams, { 
	      headers: {
	        'Content-Type': 'application/x-www-form-urlencoded'
	      }
	    });
	};

	user.logout = function() {
	    return $http.get('j_spring_security_logout');
	};

	return user;
})

.factory('Session', function() {
	var my = {};

	var handlers = [];

	my.on = function(name, callback) {
		handlers.push(callback);
	};

	my.raiseAuthFailure = function() {
		for (var i = 0; i < handlers.length; i++) {
			handlers[i]();
		};
	};

	return my;
})

;

