angular.module('i2037.directives.button', [])

.directive("i2Button", [function() {
  return {
    restrict: 'E',
    template: '<button class="btn"' 
      + 'i2-spin-opts="options"'
      + 'i2-spin-show="showSpinner" ng-transclude>'
      + '</button>',
    replace: true,
    transclude: true,
    link: function(scope, element, attrs){
      scope.options = {radius:6, width:3, length: 4, lines:11, hwaccel:'on'};
      if (attrs.type == 'submit') {
        element.addClass('btn-primary');
        scope.options.color = '#FFFFFF';
      }

      if (attrs.size) {
        element.addClass('btn-' + attrs.size);
      }

      function getContent() {
        return element.find('span').eq(0);
      }

      function loading() {
        scope.showSpinner = true;
        getContent().css('visibility', 'hidden');
      }

      function reset() {
        scope.showSpinner = false;
        element.removeClass('disabled');
        element.prop('disabled', false);
        getContent().css('visibility', 'visible');        
      }

      function disabled() {
        element.addClass('disabled');
        element.prop('disabled', true);
      }

      function setState(state) {
        switch (state) {
          case 'LOADING':
            reset();
            loading();
            break;
          case 'DISABLED':
            reset();
            disabled();
            break;
          default:
            reset();
            break;
        }
      }

      scope.$watch(attrs.i2State, function(newState, oldState) {
        setState(newState);
      }, true);
    }
  } 
}])
;
