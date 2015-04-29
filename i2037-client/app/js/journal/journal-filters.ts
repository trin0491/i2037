///<reference path="../../../typings/tsd.d.ts" />

module i2037.journal.filters {

  angular.module('i2037.journal.filters', [])
  .filter('movesActivity', [ function() {
      var activities = {
        wlk: 'Walking',
        run: 'Running',
        cyc: 'Cycling'
      };
      return function(text) {
        if (activities[text]) {
          return activities[text];
        } else {
          return text;
        }
      };
   }])
  ;
}