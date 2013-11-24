describe('i2037.journal.directives', function() {

  beforeEach(module('i2037.journal.directives'));

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

    function getText() {
      return element.find('div.media-body > div');
    }

    function getTextArea() {
      return element.find('textarea');
    }

    function getSaveBtn() {
      return element.find('button').eq(0);
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
      expect(element.find('div.media-body > div').text()).toEqual('An important comment');
    })

    it('should display the update time with a format', function() {
      expect(element.find('small').text()).toEqual('23/10/13 17:15');
    })

    it('should call deleteFn when the button is clicked', function() {
      element.find('button.close').click();
      expect($scope.delete).toHaveBeenCalled();
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
      getText().click();
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
      expect(element.find('div.media').length).toBe(0);
      var t = getTextArea();
      expect(t.val()).toEqual('');
    })

    it('should have 3 rows when text and 1 when no text', function() {
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
      var saveBtn = getSaveBtn();
      saveBtn.click();
      $scope.$digest();
      expect($scope.save).toHaveBeenCalled();
      expect($scope.save.mostRecentCall.args[0].text).toEqual('text to save');
    })

    it('should switch to edit mode when the comment is clicked', function() {
      comment.isNew(false);
      comment.text ='Some text';
      $scope.$digest();
      var text = getText();
      expect(text.length).toBe(1);
      text.click();
      $scope.$digest();
      text = getTextArea();
      expect(text.length).toBe(1);
    })

    it('should show the actions when switched to edit mode if there is text', function() {
      comment.isNew(false);
      comment.text ='Some text';
      $scope.$digest();
      var text = getText();
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
      getText().click();
      $scope.$digest();
      var saveBtn = getSaveBtn();
      expect(saveBtn.filter(':contains(Update)').length).toBe(1);
    })
  });

});
