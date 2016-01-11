/**
 * Created by richard on 27/12/2015.
 */
///<reference path="../../../../typings/tsd.d.ts" />

export class LoginForm {

  static $inject = ['$scope', '$location', 'Session', 'user'];

  public userPM:UserPM = new UserPM();

  constructor(private $scope:ILoginFormScope,
              private $location:ng.ILocationService,
              private Session:any,
              private user) {

  }

  private login() {
    this.Session.login(this.userPM.userName, this.userPM.password).then(() => {
      this.$location.path("/home");
    }, (response) => {
      var msg = 'Failed to login: status: ' + response.status;
      this.$scope.$emit('Resource::LoadingError', 'User', msg);
    });
  }

  //noinspection JSMethodCanBeStatic
  getCls(ctrl:ng.INgModelController) {
      return {
        'has-error': ctrl ? ctrl.$invalid && ctrl.$dirty : false,
        'has-success': ctrl ? ctrl.$valid && ctrl.$dirty : false
      };
  }

  //noinspection JSMethodCanBeStatic
  howErr(ngModelController:ng.INgModelController, validation:string) {
    if (ngModelController) {
      return ngModelController.$dirty && ngModelController.$error[validation];
    } else {
      return false;
    }
  }

  cancel() {
    this.$location.path("/home");
  }

  submit() {
    var expireDays = 7;
    if (this.userPM.rememberMe && this.userPM.userName) {
      $.cookie('userName', this.userPM.userName, {expires: expireDays});
    } else {
      $.removeCookie('userName', {expires: expireDays});
    }
    this.login();
  }
}

class UserPM {
  userName:String = $.cookie('userName');
  password:String = null;
  rememberMe:Boolean = true;
}

interface ILoginFormScope extends ng.IScope {
  userPM:UserPM;
  getCls(controller:ng.INgModelController);
  showErr(controller:ng.INgModelController, validation:any)
  cancel();
  submit();
}