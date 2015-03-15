///<reference path="../../../../typings/tsd.d.ts" />
///<reference path="../resources/comments.ts" />

module i2037.directives {

  import r = i2037.resources;

  interface CommentScope extends ng.IScope {
    state:string;
    textRows:number;
    saveLabel:string;
    maxlength:number;
    comment:r.IComment;
    momento:r.IComment;
    showActions:boolean;
    canDelete():void;
    delete():void;
    canSave():void;
    save():void;
    edit():void;
    canCancel():void;
    cancel():void;
    onTextFocus():void;
    saveFn(params:any):void;
    deleteFn():void;
  }

  angular.module('i2037.directives.comment', ['common/directives/comment.tpl.html'])

  .directive('i2Comment', function() {
    return {
      scope: {
        comment: '=i2Comment',
        saveFn: '&i2Save',
        deleteFn: '&i2Delete'
      },
      templateUrl: 'common/directives/comment.tpl.html',
      replace: false,
      link: function($scope:CommentScope, element, attrs) {
        element.addClass('media');

        $scope.state = 'read';
        $scope.textRows = 1;
        $scope.saveLabel = 'Update';
        $scope.maxlength = attrs.i2Maxlength;
        var momento = null;

        $scope.canDelete = function() {
          if ($scope.comment && $scope.comment.canDelete) {
            return $scope.comment.canDelete();
          } else {
            return false;
          }
        };

        $scope.delete = function() {
          if ($scope.canDelete()) {
            $scope.deleteFn();
            momento = null;          
          }
        };

        $scope.canSave = function() {
          if ($scope.comment && $scope.comment.canSave) {
            return $scope.comment.canSave();          
          } else {
            return false;
          }
        };

        $scope.save = function() {
          if ($scope.canSave()) {
            $scope.saveFn({comment:$scope.comment});
            momento = null;
          }
        };

        $scope.edit = function() {
          toEditState();
        };

        $scope.canCancel = function() {
          return momento !== null;
        };

        $scope.cancel = function() {
          if ($scope.canCancel()) {
            if (momento) {
              $scope.comment = momento;              
            }
            evalState($scope.comment.isNew());
            evalTextRows($scope.comment.text);
            evalShowActions($scope.comment.isNew(), $scope.comment.text);
          }
        };

        $scope.onTextFocus = function() {
          $scope.textRows = 3;
          $scope.showActions = true;
          momento = angular.copy($scope.comment);
        };

        function evalState(isNew) {
          switch ($scope.state) {
            case 'read':
              if (isNew) { toEditState(); }
              break;
            case 'edit':
              if (!isNew) { toReadState(); }
              break;
            default:            
              break;
          }
        }

        function toEditState() {
          $scope.state = 'edit';          
          momento = angular.copy($scope.comment);
          evalShowActions($scope.comment.isNew(), $scope.comment.text);
        }

        function toReadState() {
          $scope.state = 'read';
          $scope.momento = null;
          evalShowActions($scope.comment.isNew(), $scope.comment.text);                                  
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

        $scope.$watch('comment.isNew()', function(newVal, oldVal) {
          evalState(newVal);
          evalSaveLabel(newVal);
        }, true);

        $scope.$watch('comment.text', function(newText, oldText) {
          evalTextRows(newText);
          evalShowActions($scope.comment.isNew(), newText);
        }, true);
      }
    };
  });
}

