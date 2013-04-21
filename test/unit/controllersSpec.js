'use strict';

/* jasmine specs for controllers go here */

describe('WineViewCtrl', function(){
  var scope, ctrl, $httpBackend, dialog;
  var NO_WINES = 4;

  beforeEach(function() {
    module('i2037.services');

    var wines = [];
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
});

describe('recipie controller', function() {
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

