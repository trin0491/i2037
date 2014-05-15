(function() {
  angular.module('i2037.admin.signupform', [
    'admin/admin-signupform.tpl.html',
  ])

  .config(['$routeProvider', function($routeProvider) {
      $routeProvider.when('/signup', { templateUrl: 'admin/admin-signupform.tpl.html', controller: 'SignUpFormCtrl'});
  }])

  .controller('SignUpFormCtrl', ['$scope', '$location', 'User', 'Session', function($scope, $location, User, Session) {
    $scope.user = new User();
    $scope.temp = {};

    $scope.cancel = function() {
      $location.path('/home');
    };

    $scope.submit = function() {
      Session.signup($scope.user).then(function(user) {
        $location.path('/home');
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
      return $scope.user.password === $scope.temp.password2;
    };

  }])
  ;
}());
