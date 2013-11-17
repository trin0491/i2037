(function() {
  'use strict';

  angular.module('i2037.journal.directives', ['moves/journal-directives.tpl.html'])

  .directive('i2Comment', function() {
    return {
      scope: {
        comment: '=i2Comment',
        save: '&i2Save',
        delete: '&i2Delete',
        reply: '&'
      },
      templateUrl: 'moves/journal-directives.tpl.html',
      replace: false,
      link: function(scope, element, attrs) {
        element.addClass('media');

      }
    };
  });
}());

