(function() {
  'use strict';

  angular.module('i2037.journal.directives', ['moves/journal-directives.tpl.html'])

  .directive('i2Comment', function() {
    return {
      scope: {
        comment: '=i2Comment',
        saveFn: '&i2Save',
        deleteFn: '&i2Delete',
      },
      templateUrl: 'moves/journal-directives.tpl.html',
      replace: false,
      link: function($scope, element, attrs) {
        element.addClass('media');

        $scope.textRows = 1;
        $scope.saveLabel = 'Update';

        $scope.delete = function() {
          if ($scope.comment.canDelete && $scope.comment.canDelete()) {
            $scope.deleteFn();          
          }
        };

        $scope.save = function() {
          if ($scope.commentCopy.canSave && $scope.commentCopy.canSave()) {
            $scope.saveFn($scope.commentCopy);
          }
        };

        $scope.edit = function() {
          $scope.commentCopy = angular.copy($scope.comment);
          $scope.state = 'edit';
          evalShowActions($scope.commentCopy.isNew(), $scope.commentCopy.text);
        };

        $scope.canCancel = function() {
          return ! $scope.comment.isNew() ;
        };

        $scope.cancel = function() {
          if ($scope.canCancel()) {
            $scope.state = 'read';
            $scope.showActions = false;
            $scope.commentCopy = null;            
          }
        };

        $scope.onTextFocus = function() {
          $scope.textRows = 3;
          $scope.showActions = true;
        };

        function evalState(isNew) {
          if (isNew) {
            $scope.edit();
          } else {
            $scope.state = 'read';
          }                   
        }

        function evalShowActions(isNew, text) {
          if (isNew && !text) {
            $scope.showActions = false;
          } else {
            $scope.showActions = true;
          }
        }

        function evalTextRows(text) {
          if (text) {
            $scope.textRows = 3;
          } else {
            $scope.textRows = 1;
          }          
        }

        function evalSaveLabel(isNew) {
          $scope.saveLabel = isNew ? 'Create' : 'Update';         
        }

        $scope.$watch('comment.isNew()', function(isNew) {
          evalState(isNew);
          evalSaveLabel(isNew);
        }, true);

        $scope.$watch('commentCopy.text', function(text) {
          evalTextRows(text);
          evalShowActions($scope.comment.isNew(), text);
        }, true);

      }
    };
  });
}());

