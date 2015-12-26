import adminLoginForm from "./admin-loginform";
import adminSignupForm from "./admin-signupform";

export default angular.module('i2037.admin', [
  adminLoginForm.name,
  adminSignupForm.name
  ]);
