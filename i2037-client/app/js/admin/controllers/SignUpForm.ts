/**
 * Created by richard on 27/12/2015.
 */
///<reference path="../../../../typings/tsd.d.ts" />

export class SignUpForm {

  //noinspection JSUnusedGlobalSymbols
  static $inject = ['$scope', '$location', 'Session', 'user'];

  password2:string;
  title:string;
  isNewUser:boolean;

  constructor(private $scope, private $location, private Session, public userPM) {
    if (this.userPM.$id() != null) {
      this.title = 'Change Password';
      this.isNewUser = false;
    } else {
      this.title = 'Sign Up';
      this.isNewUser = true;
    }

  }

  private goHome() {
    this.$location.path('/home');
  }

  private signup() {
    this.Session.signup(this.userPM).then(() => {
      this.goHome();
    }, (response) => {
      var msg = 'Failed to save user: status: ' + response.status;
      this.$scope.$emit('Resource::SaveError', 'User', msg);
    });
  }

  private update() {
    this.userPM.$update().then(() => {
      this.goHome();
    }, (response) => {
      var msg = 'Failed to save user: status: ' + response.status;
      this.$scope.$emit('Resource::SaveError', 'User', msg);
    });
  }

  cancel() {
    this.goHome();
  }

  submit() {
    if (this.isNewUser) {
      this.signup();
    } else {
      this.update();
    }
  };

  //noinspection JSUnusedGlobalSymbols
  getCls(ngModelController) {
    return {
      'has-error': ngModelController ? ngModelController.$invalid && ngModelController.$dirty : false,
      'has-success': ngModelController ? ngModelController.$valid && ngModelController.$dirty : false
    };
  }

  //noinspection JSMethodCanBeStatic
  showErr(ngModelController, validation) {
    return ngModelController ? ngModelController.$dirty && ngModelController.$error[validation] : false;
  }

  //noinspection JSUnusedGlobalSymbols
  passwordsMatch() {
    return this.userPM.password === this.password2;
  }
}