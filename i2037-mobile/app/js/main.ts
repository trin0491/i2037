/**
 * Created by richard on 06/09/2015.
 */
import AppModule = require('app');

angular.element(document).ready(function() {
  angular.bootstrap(document, [AppModule.NAME]);
});