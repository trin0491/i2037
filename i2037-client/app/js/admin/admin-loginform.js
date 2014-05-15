(function() {
  angular.module('i2037.admin.loginform', [
    'ngRoute',
    'admin/admin-loginform.tpl.html',
  ])

  .config(['$routeProvider', function($routeProvider) {
      $routeProvider.when('/login', { 
        templateUrl: 'admin/admin-loginform.tpl.html', 
        controller: 'LoginFormCtrl',
        resolve: {
          userName: function() {
            return null;
          }
        }
      });
  }])

  .controller('LoginFormCtrl', ['$scope', '$location', 'Session', 'userName',
      function ($scope, $location, Session, userName) {

    var authDetails = {    
      userName: userName,
      password: '',
      rememberMe: true,    
      userNameReadonly: false,
    };

    if (userName) {
      $scope.title = 'Change Password';
      authDetails.userNameReadonly = true;
    } else {
      $scope.title = 'Login';
      authDetails.userName = $.cookie('userName');
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
      if (authDetails.rememberMe && authDetails.userName) {
        $.cookie('userName', authDetails.userName, { expires: expireDays });
      } else {
        $.removeCookie('userName', { expires: expireDays });
      }

      Session.login(authDetails.userName, authDetails.password).then(function(user) {
        $location.path("/home");
      }, function(data, status) {
        alert("Failed to authenticate");
      });
    };

    $scope.authDetails = authDetails;  
  }])
  ;
}());
