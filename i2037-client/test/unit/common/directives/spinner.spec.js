describe('i2037.directives.spinner', function() {

  beforeEach(module('i2037.directives.spinner'));

  describe('i2Spinner', function() {
    var $scope, element, $compile, Spinner, spin, stop;

    beforeEach(function() {
      module(function($provide) {
        Spinner = jasmine.createSpy();
        spin = jasmine.createSpy('spin');
        Spinner.prototype.spin = spin;
        stop = jasmine.createSpy('stop');
        Spinner.prototype.stop = stop;
        window.Spinner = Spinner;
      });

      var html = '<button i2-spin-opts="options" i2-spin-show="isLoading">Submit</button>';

      inject(function(_$rootScope_, _$compile_) {
        $scope = _$rootScope_.$new();
        $compile = _$compile_;
        element = $compile(html)($scope);
        $scope.options = {radius:6};
        $scope.$digest();
      })      
    });

    it('should deal with undefined', function() {
      expect(Spinner).not.toHaveBeenCalled();
      expect(stop).not.toHaveBeenCalled();
      expect(spin).not.toHaveBeenCalled();      
    });

    it('should spin when loading', function() {
      $scope.isLoading = true;
      $scope.$digest();
      expect(Spinner).toHaveBeenCalled();
      expect(spin).toHaveBeenCalled();      
    });

    it('should use the spin options', function() {
      $scope.isLoading = true;
      $scope.$digest();
      expect(Spinner).toHaveBeenCalledWith({radius:6});
    });

    it('should stop spinning when it stops loading', function() {
      $scope.isLoading = true;
      $scope.$digest();
      expect(Spinner).toHaveBeenCalled();
      expect(spin.calls.length).toEqual(1);            
      $scope.isLoading = false;
      $scope.$digest();
      expect(stop.calls.length).toEqual(1);      
    });

    it('should reset spinner on config change if it is spinning', function() {
      $scope.isLoading = true;
      $scope.$digest();
      $scope.options = {radius:7};
      $scope.$digest();
      expect(Spinner).toHaveBeenCalled();
      expect(spin.calls.length).toEqual(2);      
      expect(stop.calls.length).toEqual(1);                  
    });

    it('should reset spinner on config change if it is not spinning', function() {
      $scope.isLoading = false;
      $scope.$digest();
      $scope.options = {radius:7};
      $scope.$digest();
      expect(Spinner).not.toHaveBeenCalled();
      expect(spin).not.toHaveBeenCalled();      
      expect(stop).not.toHaveBeenCalled();                  
    });

    it('should stop spinning on destruction', function() {
      $scope.isLoading = true;
      $scope.$digest();
      expect(Spinner.calls.length).toEqual(1);
      expect(spin.calls.length).toEqual(1);   
      $scope.$destroy();
      expect(stop.calls.length).toEqual(1);            
    });   
  });

});
