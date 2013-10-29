describe('i2037.directives.button', function() {

  beforeEach(module('i2037.directives.button'));

  describe('i2Button', function() {
    var $scope, $compile;

    beforeEach(function() {
      inject(function(_$rootScope_, _$compile_) {
        $scope = _$rootScope_.$new();
        $compile = _$compile_;
      })      
    });

    function compile(html) {
      var element = $compile(html)($scope);
      $scope.$digest();
      return element;
    }

    it('should be a button', function() {
      var element = compile('<i2-button>Submit</button>');
      expect(element.eq(0).is('button')).toBe(true);
    });

    it('should have the btn class', function() {
      var element = compile('<i2-button>Submit</button>');
      expect(element.hasClass('btn')).toBe(true);
    })

    it('should have btn-primary class if it is submit', function() {
      var element = compile('<i2-button type="submit">Submit</button>');
      expect(element.hasClass('btn-primary')).toBe(true);
    })

    it('should set the size class if size is specified', function() {
      var element = compile('<i2-button size="large">Submit</button>');
      expect(element.hasClass('btn-large')).toBe(true);      
    })

    it('should transclude the content', function() {
      var element = compile('<i2-button>Submit</button>');
      expect(element.children('span').text()).toEqual('Submit');
    })

    it('should hava disabled state', function() {
      var element = compile('<i2-button i2-state="state">Submit</button>');
      $scope.state = 'DISABLED';
      $scope.$digest();
      expect(element.hasClass('disabled')).toBe(true);
      expect(element.prop('disabled')).toBe(true);
      $scope.state = 'default';
      $scope.$digest();
      expect(element.hasClass('disabled')).toBe(false);
      expect(element.prop('disabled')).toBe(false);      
    })

  });

});
