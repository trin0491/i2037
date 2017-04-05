/**
 * Created by richard on 27/12/2015.
 */
///<reference path="../../../../typings/tsd.d.ts" />
import {AbstractControl} from "@angular/forms";
import {Inject, Component, EventEmitter, Output} from "@angular/core";

const TEMPLATE = 'js/admin/templates/LoginForm.tpl.html';

@Component({
  selector: 'i2-login-form',
  templateUrl: TEMPLATE
})
export class LoginForm {

  @Output() loadingError = new EventEmitter<String>();

  userPM:UserPM = new UserPM();

  private _class:any = {
    'has-error': false,
    'has-success': false
  };

  constructor(@Inject('$location') private $location:ng.ILocationService,
              @Inject('Session') private Session:any) {

  }

  private login() {
    this.Session.login(this.userPM.userName, this.userPM.password).then(() => {
      this.$location.path("/home");
    }, (response) => {
      var msg = 'Failed to login: status: ' + response.status;
      this.loadingError.emit(msg);
    });
  }

  //noinspection JSMethodCanBeStatic
  getCls(ctrl:AbstractControl) {
    this._class['has-error'] =  ctrl ? !ctrl.valid && ctrl.dirty : false;
    this._class['has-success'] = ctrl ? ctrl.valid && ctrl.dirty : false;
    return this._class;
  }

  //noinspection JSMethodCanBeStatic
  hasErr(ctrl:AbstractControl, validation:string) {
    if (ctrl) {
      return ctrl.dirty && ctrl.hasError(validation);
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