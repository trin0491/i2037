///<reference path="../../../typings/tsd.d.ts" />

describe('LoginFormCtrl', function () {
  var mockSession, $location;

  // beforeEach(() => {
  //   mockSession = jasmine.createSpyObj('Session', ['getUser', 'login']);
  //   $location = jasmine.createSpyObj('$location', ['path']);
  //
  //   return [
  //     provide('$location', {useValue: $location}),
  //     provide('Session', {useValue: mockSession})
  //   ]
  // });
  //
  //
  // it('should define an empty userPM on the scope', inject([TestComponentBuilder], (tcb) => {
  //   return tcb.createAsync(LoginForm).then((fixture) => {
  //     fixture.detectChanges();
  //     var loginForm = fixture.componentInstance;
  //     expect(loginForm.userPM).toBeDefined();
  //     expect(loginForm.userPM.userName).toBeUndefined();
  //     expect(loginForm.userPM.password).toBeNull();
  //     expect(loginForm.userPM.rememberMe).toBeTruthy();
  //   });
  // }));

  //it('should go to the home page on cancel', injectAsync([TestComponentBuilder], (tcb) => {
  //  return tcb.createAsync(LoginForm).then((fixture) => {
  //    fixture.detectChanges();
  //    var loginForm = fixture.componentInstance;
  //    loginForm.cancel();
  //    expect($location.path).toHaveBeenCalledWith('/home');
  //  });
  //}));

  //it('should login into a session on submit', injectAsync([TestComponentBuilder], (tcb) => {
  //  return tcb.createAsync(LoginForm).then((fixture) => {
  //    fixture.detectChanges();
  //    var loginForm = fixture.componentInstance;
  //    var resolvePromise = null;
  //    var promise = new Promise((resolve) => resolvePromise = resolve);
  //    mockSession.login.and.returnValue(promise);
  //
  //    var userName = 'aUser';
  //    var password = 'aPassword';
  //    loginForm.userPM.userName = userName;
  //    loginForm.userPM.password = password;
  //    loginForm.userPM.rememberMe = false;
  //    loginForm.submit();
  //    expect(mockSession.login).toHaveBeenCalledWith(userName, password);
  //
  //    resolvePromise({});
  //    expect($location.path).toHaveBeenCalledWith('/home');
  //  });
  //}));
  //
  //it('should raise an event on login error', injectAsync([TestComponentBuilder], (tcb) => {
  //  return tcb.createAsync(LoginForm).then((fixture) => {
  //    fixture.detectChanges();
  //    var loginForm = fixture.componentInstance;
  //    var resolvePromise = null;
  //    var promise = new Promise((resolve) => resolvePromise = resolve);
  //    mockSession.login.and.returnValue(promise);
  //
  //    var userName = 'aUser';
  //    var password = 'aPassword';
  //    loginForm.userPM.userName = userName;
  //    loginForm.userPM.password = password;
  //    loginForm.userPM.rememberMe = false;
  //    loginForm.submit();
  //    expect(mockSession.login).toHaveBeenCalledWith(userName, password);
  //
  //    resolvePromise({});
  //    expect($location.path).not.toHaveBeenCalled();
  //    // TODO expect($scope.$emit).toHaveBeenCalled();
  //  });
  //}));
});

