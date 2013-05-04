'use strict';

/* jasmine specs for controllers go here */

describe('WineViewCtrl', function(){
  var wines, scope, ctrl, $httpBackend, dialog;
  var NO_WINES = 4;

  beforeEach(function() {
    module('i2037.services');

    wines = [];
    for (var i = 0; i < NO_WINES; i++) {
      wines[i] = {
        name: 'wine',
        description: 'description'
      };
    }

    inject(function($rootScope, _$httpBackend_, $controller) {
      $httpBackend = _$httpBackend_;
      $httpBackend.expectGET('/cellar-webapp/wines').respond(wines);
      scope = $rootScope.$new();
      dialog = {
        dialog: function() {
          return {
            open: function() {
              return { then: function() {}}
            }
          };
        },
      };
      ctrl = $controller('WineViewCtrl', {$scope: scope, $dialog: dialog});
    });
  });

  it('should load all wines', function() {
    expect(scope.wines).toEqual([]);
    $httpBackend.flush();
    expect(scope.wines.length).toEqual(NO_WINES);
  });

  it('should have a noRows method', function() {
    expect(scope.noRows).toBeDefined();
    $httpBackend.flush();
    expect(scope.noRows()).toEqual(1);
  });

  it('should have a wine grid', function() {
    expect(scope.wineGrid).toBeUndefined();
    $httpBackend.flush();
    expect(scope.wineGrid).toBeDefined();
    expect(scope.wineGrid.length).toEqual(1);
  });

  it('should make small thumbnails', function() {
    expect(scope.smallThumbnails).toBeDefined();
    $httpBackend.flush();
    expect(scope.smallThumbnails()).toBeUndefined();
    expect(scope.noRows()).toEqual(1);
    expect(scope.wineCls).toEqual('span3');
  });

  it('should have large thumbnails method', function() {
    expect(scope.largeThumbnails).toBeDefined();
    $httpBackend.flush();
    expect(scope.largeThumbnails()).toBeUndefined();
    expect(scope.noRows()).toEqual(2);
    expect(scope.wineCls).toEqual('span4');
  });

  it('should have an add wine method', function() {
    expect(scope.add).toBeDefined();
    expect(scope.add()).toBeUndefined();
  });

  it('should have an edit wine method', function() {
    expect(scope.edit).toBeDefined();
    expect(scope.edit(wines[0])).toBeUndefined();   
  });
});

describe('wineform controller', function() {
  var wine, scope, ctrl, dialog, $httpBackend, grapes;
  var mode = 'Edit';

  beforeEach(function() {
    module('i2037.services');
    wine = {
      name: 'aWine',
      description: 'aDescription',
      grapeId: 1
    };

    grapes = [ { grapeId: 1, name: "aGrape"} ];

    inject(function($rootScope, $controller, _$httpBackend_) {
      $httpBackend = _$httpBackend_;
      $httpBackend.expectGET('/cellar-webapp/grapes').respond(grapes);
      scope = $rootScope.$new();
      dialog = {
        isOpen: true,
        close: function(result) {
          this.isOpen = false;
          this.rv = result;
        }
      };
      ctrl = $controller('WineFormCtrl', {
        $scope: scope, 
        dialog: dialog, 
        wine: wine,
        mode: mode
      });
    })
  });

  it('should bind the wine', function() {
    expect(scope.wine).toEqual(wine);
  });

  it('should bind the mode', function() {
    expect(scope.mode).toEqual(mode);
  })

  it('should have a cancel method', function() {
    expect(angular.isFunction(scope.cancel)).toBe(true);
    expect(dialog.isOpen).toBe(true);
    scope.cancel();
    expect(dialog.isOpen).toBe(false);
    expect(dialog.rv).toBeUndefined();
  });

  it('should have a submit method', function() {
    expect(angular.isFunction(scope.submit)).toBe(true);
    expect(dialog.rv).toBeUndefined();
    scope.submit();
    expect(dialog.rv).toEqual(wine);
  });

  it('should bind grapes', function() {
    expect(scope.grapes).toEqual([]);
    $httpBackend.flush();
    expect(scope.grapes.length).toBe(1);
  });

  it('should bind grapeName', function() {
    expect(scope.grapeName).toBeUndefined();
    $httpBackend.flush();
    expect(scope.grapeName).toEqual("aGrape");
  });

  it('should identify new grapes', function() {
    $httpBackend.flush();
    expect(scope.isNewGrape).toBe(false);
    scope.grapeName = 'aNewGrape';
    scope.onGrapeChange();
    expect(scope.isNewGrape).toBe(true);
    scope.grapeName = 'aGrape';
    scope.onGrapeChange();
    expect(scope.isNewGrape).toBe(false);
  })
});

describe('recipe controller', function() {
  var scope, ctrl;

  beforeEach(function() {
    inject(function($rootScope, $controller) {
      scope = $rootScope.$new();
      ctrl = $controller('RecipesCtrl', {$scope: scope});
    });
  });

  it('should be defined', function() {
    expect(ctrl).toBeDefined();
  });
});

