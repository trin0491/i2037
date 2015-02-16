module admin {

  class UserPM {
    userName:String = $.cookie('userName');
    password: String = null;
    rememberMe: Boolean = true;
  }

  interface ILoginFormScope extends ng.IScope {
    userPM:UserPM;
    getCls(controller:ng.INgModelController);
    showErr(controller:ng.INgModelController, validation:any)
    cancel();
    submit();
  }

  angular.module('i2037.admin.loginform', [
    'ngRoute',
    'i2037.services',
    'admin/admin-loginform.tpl.html',
  ])

  .config(['$routeProvider', function($routeProvider:ng.route.IRouteProvider) {
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
      function ($scope:ILoginFormScope, $location, Session, user) {

    var userPM:UserPM = new UserPM();

    function login() {
      Session.login(userPM.userName, userPM.password).then(function(user) {
        $location.path("/home");
      }, function(response) {
        var msg = 'Failed to login: status: ' + response.status;        
        $scope.$emit('Resource::LoadingError', 'User', msg);      
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
}
