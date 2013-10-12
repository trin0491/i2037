/* Filters */

angular.module('i2037.moves.filters', [])
.filter('activity', [ function() {
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
    }
 }])

;
