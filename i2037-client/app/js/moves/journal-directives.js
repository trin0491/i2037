'use strict';

angular.module('i2037.journal.directives', [])

.directive('i2Comment', function() {
  return {
    scope: {
      comment: '=i2Comment',
      save: '&i2Save',
      delete: '&i2Delete',
      reply: '&'
    },
    template: '<a class="pull-right">'
      + '<img class="media-object" ng-src="{{comment.img}}">'
      + '<button ng-click="delete()" class="close">&times;</button>'
      + '</a>'
      + '<div class="media-body">'
      + '<h5 class="media-heading">{{comment.author}}</h5>'
      + '<div class="media">{{comment.text}}</div>'
      + '<p><small>{{comment.lastUpdateTime | date:"d/M/yy H:mm"}}</small></p>'
      + '</div>',
    replace: false,
    link: function(scope, element, attrs) {
      element.addClass('media');

    }
  }
})
;
