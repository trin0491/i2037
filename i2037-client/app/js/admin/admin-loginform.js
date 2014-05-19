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
  }])

  .controller('LoginFormCtrl', ['$scope', '$location', 'Session', 'user',
      function ($scope, $location, Session, user) {

    var userPM = {    
      userName: $.cookie('userName'),
      password: null,
      rememberMe: true,    
    };

    function login() {
      Session.login(userPM.userName, userPM.password).then(function(user) {
        $location.path("/home");
      }, function(data, status) {
        var msg = 'Failed to login: status: ' + response.status + ' data: ' + response.data;        
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
      login();
    };

    $scope.userPM = userPM;  
  }])
  ;
}());
