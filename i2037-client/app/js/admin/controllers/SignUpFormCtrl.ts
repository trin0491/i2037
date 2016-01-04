/**
 * Created by richard on 27/12/2015.
 */
///<reference path="../../../../typings/tsd.d.ts" />

SignUpFormCtrl.$inject = ['$scope', '$location', 'Session', 'user'];

export function SignUpFormCtrl($scope, $location, Session, user) {
  $scope.userPM = user;
  $scope.temp = {};

  if (user.$id() != null) {
    $scope.title = 'Change Password';
    $scope.isNewUser = false;
  } else {
    $scope.title = 'Sign Up';
    $scope.isNewUser = true;
  }

  function goHome() {
    $location.path('/home');
  }

  function signup() {
    Session.signup(user).then(function () {
      goHome();
    }, function (response) {
      var msg = 'Failed to save user: status: ' + response.status;
      $scope.$emit('Resource::SaveError', 'User', msg);
    });
  }

  function update() {
    user.$update().then(function () {
      goHome();
    }, function (response) {
      var msg = 'Failed to save user: status: ' + response.status;
      $scope.$emit('Resource::SaveError', 'User', msg);
    });
  }

  $scope.cancel = function () {
    goHome();
  };

  $scope.submit = function () {
    if ($scope.isNewUser) {
      signup();
    } else {
      update();
    }
  };

  $scope.getCls = function (ngModelController) {
    if (!ngModelController) {
      return {
        'has-error': false,
        'has-success': false
      };
    } else {
      return {
        'has-error': ngModelController.$invalid && ngModelController.$dirty,
        'has-success': ngModelController.$valid && ngModelController.$dirty
      };
    }
  };

  $scope.showErr = function (ngModelController, validation) {
    if (ngModelController) {
      return ngModelController.$dirty && ngModelController.$error[validation];
    } else {
      return false;
    }
  };

  $scope.passwordsMatch = function () {
    return $scope.userPM.password === $scope.temp.password2;
  };

}