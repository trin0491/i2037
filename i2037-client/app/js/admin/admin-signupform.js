(function() {
  angular.module('i2037.admin.signupform', [
    'admin/admin-signupform.tpl.html',
  ])

  .controller('SignUpFormCtrl', ['$scope', '$modalInstance', 'User', function($scope, $modalInstance, User) {
    $scope.user = new User();

    $scope.cancel = function() {
      $modalInstance.close();
    };

    $scope.submit = function() {
      $scope.user.$save().then(function(user) {
        $modalInstance.close(user);
      });
    };

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

    $scope.passwordsMatch = function() {
      return $scope.user.password === $scope.password2;
    };

    $scope.canSubmit = function() {
      return $scope.signUpForm && $scope.signUpForm.$dirty &&
        $scope.signUpForm.$valid && $scope.passwordsMatch();
    };
  }])
  ;
}());
