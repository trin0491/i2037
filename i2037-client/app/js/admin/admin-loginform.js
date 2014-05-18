(function() {
  angular.module('i2037.admin.loginform', [
    'ngRoute',
    'i2037.services',
    'admin/admin-loginform.tpl.html',
  ])

  .config(['$routeProvider', function($routeProvider) {
      $routeProvider.when('/login', { 
        templateUrl: 'admin/admin-loginform.tpl.html', 
        controller: 'LoginFormCtrl',
        resolve: {
          user: function() {
            return null;
          }
        }
      });

      $routeProvider.when('/changepassword', {
        templateUrl: 'admin/admin-loginform.tpl.html', 
        controller: 'LoginFormCtrl',
        resolve: {
          user: ['Session', function(Session) {
            return Session.getUser();
          }]
        }        
      });
  }])

  .controller('LoginFormCtrl', ['$scope', '$location', 'Session', 'user',
      function ($scope, $location, Session, user) {

    var userPM = {    
      userName: null,
      password: null,
      rememberMe: true,    
      userNameReadonly: false,
    };

    if (user) {      
      $scope.title = 'Change Password';
      userPM.userName = user.userName;
      userPM.userNameReadonly = true;
    } else {
      $scope.title = 'Login';
      userPM.userName = $.cookie('userName');
    }

    function login() {
      Session.login(userPM.userName, userPM.password).then(function(user) {
        $location.path("/home");
      }, function(data, status) {
        var msg = 'Failed to login: status: ' + response.status + ' data: ' + response.data;        
        $scope.$emit('Resource::SaveError', 'User', msg);      
      });      
    }

    function changePassword() {
      Session.changePassword(userPM.password).then(function() {
        $location.path("/home");
      }, function(data, status) {
        var msg = 'Failed to change password: status: ' + response.status + ' data: ' + response.data;        
        $scope.$emit('Resource::SaveError', 'User', msg);              
      });      
    }

    $scope.getCls = function(ngModelController) {
      if (!ngModelController) {
        return {};
      } else {
        return {
          'has-error': ngModelController.$invalid && ngModelController.$dirty,
          'has-success': ngModelController.$valid && ngModelController.$dirty
        };      
      }
    };

    $scope.showErr = function(ngModelController, validation) {
      if (ngModelController) {
        return ngModelController.$dirty && ngModelController.$error[validation];
      } else {
        return false;
      }
    };

    $scope.cancel = function(){
      $location.path("/home");
    };

    $scope.submit = function() {
      var expireDays = 7;
      if (userPM.rememberMe && userPM.userName) {
        $.cookie('userName', userPM.userName, { expires: expireDays });
      } else {
        $.removeCookie('userName', { expires: expireDays });
      }

      if (user) {        
        changePassword();
      } else {
        login();
      }
    };

    $scope.userPM = userPM;  
  }])
  ;
}());
