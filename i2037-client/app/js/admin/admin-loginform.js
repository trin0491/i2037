(function() {
  angular.module('i2037.admin.loginform', [
    'admin/admin-loginform.tpl.html',
  ])

  .controller('LoginFormCtrl', ['$scope', '$modalInstance', 'User', 'userName',
      function ($scope, $modalInstance, User, userName) {

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
      $modalInstance.close();
    };

    $scope.submit = function() {
      var expireDays = 7;
      if (authDetails.rememberMe && authDetails.userName) {
        $.cookie('userName', authDetails.userName, { expires: expireDays });
      } else {
        $.removeCookie('userName', { expires: expireDays });
      }

      User.login(authDetails.userName, authDetails.password).then(function(user) {
        $modalInstance.close(user);
      }, function(data, status) {
        alert("Failed to authenticate");
      });
    };

    $scope.authDetails = authDetails;  
  }])
  ;
}());
