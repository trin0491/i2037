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
        lastUpdateTime: date
      }
      $scope.comment = comment;
      $scope.close = jasmine.createSpy('close');
      element = compile('<li i2-comment="comment" i2-delete="close()"></li>');
    });

    function compile(html) {
      var element = $compile(html)($scope);
      $scope.$digest();
      return element;
    }

    it('should keep the element', function() {
      expect(element.eq(0).is('li')).toBe(true);
    })

    it('should add media class to the element', function() {
      expect(element.eq(0).hasClass('media')).toBe(true);
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
      expect(element.find('div.media').text()).toEqual('An important comment');
    })

    it('should display the update time with a format', function() {
      expect(element.find('small').text()).toEqual('23/10/13 17:15');
    })

    it('should call delete when the button is clicked', function() {
      element.find('button.close').click();
      expect($scope.close).toHaveBeenCalled();
    })
  });

});
