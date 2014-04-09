describe('i2037.directives.comment', function() {

  beforeEach(module('i2037.directives.comment'));

  describe('i2Comment', function() {
    var $scope, $compile, comment, element;

    beforeEach(function() {
      inject(function(_$rootScope_, _$compile_) {
        $scope = _$rootScope_.$new();
        $compile = _$compile_;
      })
      var date = new Date("October 23, 2013 17:15:23");
      comment = {
        author: 'Adam Smith',
        img: 'http://www.example.com/apicture.jpg',
        text: 'An important comment',
        lastUpdateTime: date,

        isNew: function(val) {
          if (val !== undefined) {
            this.$isNew = val;
          } 
          return this.$isNew;                      
        },

        canDelete: function() {
          return !this.$isNew;
        },

        canSave: function() {
          return this.text && this.text.length > 0;
        }
      }
      comment.isNew(false);
      $scope.comment = comment;
      $scope.delete = jasmine.createSpy('delete');
      $scope.save = jasmine.createSpy('save');
      element = compile('<li i2-comment="comment" i2-delete="delete()" i2-save="save(comment)"></li>');
    });

    function compile(html) {
      var element = $compile(html)($scope);
      $scope.$digest();
      return element;
    }

    function getTextDiv() {
      return element.find('div.media-body > div');
    }

    function getTextArea() {
      return element.find('textarea');
    }

    function getSaveBtn() {
      return element.find('button').eq(0);
    }

    function getCancelBtn() {
      return element.find('button').eq(1);
    }

    function getDeleteBtn() {
      return element.find('button').eq(2);
    }

    it('should not replace the element', function() {
      expect(element.eq(0).is('li')).toBe(true);
    })

    it('should add a media element', function() {
      expect(element.hasClass('media')).toBe(true);
    });

    it('should have a media body', function() {
      expect(element.find('div.media-body').length).toBe(1);
    })

    it('should have a heading with the author', function() {
      expect(element.find('h5').text()).toEqual('Adam Smith');
    })

    it('should have an img of the author', function() {
      var img = element.find('img.media-object');
      expect(img.length).toBe(1);
      expect(img.attr('src')).toEqual('http://www.example.com/apicture.jpg');
    })

    it('should display the comment', function() {
      expect(getTextDiv().text()).toEqual('An important comment');
    })

    it('should display the update time with a format', function() {
      expect(element.find('small').text()).toEqual('23/10/13 17:15');
    })

    it('should disable delete for new comment', function() {
      comment.isNew(true);
      $scope.$digest();
      var deleteBtn = getDeleteBtn();
      expect(deleteBtn.attr('disabled')).toBeTruthy();
      deleteBtn.click();
      expect($scope.delete).not.toHaveBeenCalled();
    })

    it('should enable delete for existing comment', function() {
      comment.isNew(false);
      getTextDiv().click();
      $scope.$digest();
      var deleteBtn = getDeleteBtn();
      expect(deleteBtn.attr('disabled')).toBeFalsy();
      deleteBtn.click();
      expect($scope.delete).toHaveBeenCalled();            
    })

    it('should have an empty textarea for a new comment', function() {
      comment.isNew(true);
      comment.text = '';
      $scope.$digest();
      expect(getTextDiv().length).toBe(0);
      var t = getTextArea();
      expect(t.val()).toEqual('');
    })

    it('should have 3 rows when text', function() {
      comment.isNew(true);
      $scope.$digest();
      expect(getTextArea().attr('rows')).toEqual('3');
    })

    it('should have 1 row when no text', function() {
      comment.isNew(true);
      comment.text = '';
      $scope.$digest();      
      expect(getTextArea().attr('rows')).toEqual('1');            
    })

    it('should not show the actions for new comment with no text', function() {
      comment.isNew(true);
      comment.text = ''
      $scope.$digest();
      expect(element.find('button').hasClass('ng-hide')).toBeTruthy;

      comment.text = 'Something to save';
      $scope.$digest();
      expect(element.find('button').hasClass('ng-hide')).toBeFalsy();      
    })

    it('should not call saveFn if there is no text', function() {
      comment.isNew(true);
      comment.text = '';
      $scope.$digest();            
      var saveBtn = getSaveBtn();
      expect(saveBtn.attr('disabled')).toBeTruthy();
      saveBtn.click();
      $scope.$digest();
      expect($scope.save).not.toHaveBeenCalled();
    })

    it('should call saveFn when action is clicked', function() {
      comment.isNew(true);
      comment.text = 'text to save';
      $scope.$digest();            
      getSaveBtn().click();
      $scope.$digest();
      expect($scope.save).toHaveBeenCalled();
      expect($scope.save.mostRecentCall.args[0].text).toEqual('text to save');
    })

    it('should switch to edit mode when the comment is clicked', function() {
      comment.isNew(false);
      comment.text ='Some text';
      $scope.$digest();
      var text = getTextDiv();
      expect(text.length).toBe(1);
      text.click();
      $scope.$digest();
      text = getTextArea();
      expect(text.length).toBe(1);
    })

    it('should switch to read mode when cancel is clicked for an exiting comment', function() {
      comment.isNew(false);
      comment.text ='Some text';
      $scope.$digest();
      getTextDiv().click();
      $scope.$digest();
      getTextArea().val('Some text we do not want');
      getCancelBtn().click();
      $scope.$digest();
      expect(getTextDiv().text()).toEqual('Some text');            
    })    

    xit('should clear edit text when cancel is clicked for a new comment', function() {
      comment.isNew(true);
      comment.text ='A new comment';
      $scope.$digest();
      expect(getTextArea().val()).toEqual('A new comment');         
      getTextArea().val('');
      $scope.$digest();
      getCancelBtn().click();
      $scope.$digest();
      expect(getTextArea().text()).toEqual('A new comment');            
    })    

    it('should show the actions in edit mode if there is text', function() {
      comment.isNew(false);
      comment.text ='Some text';
      $scope.$digest();
      var text = getTextDiv();
      text.click();
      $scope.$digest();
      expect(element.find('button').length).toBe(3);
    })

    it('should show Create action for new comment', function() {
      comment.isNew(true);
      comment.text = 'something to save';
      $scope.$digest();
      var saveBtn = getSaveBtn();
      expect(saveBtn.filter(':contains(Create)').length).toBe(1);
    })

    it('should show Update action for an existing comment', function() {
      comment.isNew(false);
      comment.text = 'a comment';
      $scope.$digest();
      getTextDiv().click();
      $scope.$digest();
      var saveBtn = getSaveBtn();
      expect(saveBtn.filter(':contains(Update)').length).toBe(1);
    })

    it('should change to edit mode when the comment is updated', function() {
      $scope.$digest();
      expect(getTextDiv().length).toBe(1);
      var newComment = {
        text: '',
        isNew: function(val) {
          return true;
        },
        canDelete: function() {
          return false;
        },
        canSave: function() {
          return true;
        }        
      };
      $scope.comment = newComment;
      $scope.$digest();
      expect(getTextDiv().length).toBe(0);
      expect(getTextArea().val()).toBe('');
    })

    it('should change to read mode when the comment is updated', function() {
      comment.isNew(true);
      comment.text = '';
      $scope.$digest();
      expect(getTextArea().length).toBe(1);
      var existingComment = {
        text: 'an existing comment',
        isNew: function(val) {
          return false;
        },
        canDelete: function() {
          return true;
        },
        canSave: function() {
          return true;
        }        
      };
      $scope.comment = existingComment;
      $scope.$digest();
      expect(getTextDiv().length).toBe(1);
      expect(getTextDiv().text()).toBe('an existing comment');
    })

    it('should reset the text when a new comment is updated', function() {
      comment.isNew(true);
      comment.text = '';
      $scope.$digest();
      expect(getTextArea().val()).toBe('');
      var newComment = {
        text: 'different text',
        isNew: function(val) {
          return true;
        },
        canDelete: function() {
          return false;
        },
        canSave: function() {
          return true;
        }        
      };
      $scope.comment = newComment;
      $scope.$digest();
      expect(getTextArea().val()).toBe('different text');
    })

    it('should set maxlength on textarea if it is set on the scope', function() {
      comment.isNew(true);
      $scope.$digest();
      expect(getTextArea().attr('maxlength')).toEqual('');

      element = compile('<li i2-comment="comment" i2-delete="delete()" i2-save="save(comment)" i2-maxlength="80"></li>');
      $scope.$digest();      
      expect(getTextArea().attr('maxlength')).toEqual('80');      
    })
  });

});
