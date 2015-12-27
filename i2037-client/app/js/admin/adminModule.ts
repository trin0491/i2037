import adminLoginForm from "./admin-loginform";
import adminSignupForm from "./admin-signupform";

export const adminModule = angular.module('i2037.admin', [
  adminLoginForm.name,
  adminSignupForm.name
  ]);
