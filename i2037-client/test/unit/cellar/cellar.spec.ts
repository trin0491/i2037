import cellar from "../../../app/js/cellar/cellar";

describe('i2037.cellar', function () {
  beforeEach(function () {
    module(cellar.name);
  });

  describe('ListWineCtrl', function () {
    var ctrl, params, scope;
    var NO_WINES = 4;

    beforeEach(function () {
      var wines = [];
      for (var i = 0; i < NO_WINES; i++) {
        wines[i] = {
          name: 'wine',
          description: 'description'
        };
      }

      inject(function ($rootScope, $controller) {
        scope = $rootScope;
        params = {
          $scope: scope,
          $location: jasmine.createSpyObj('$location', ['path']),
          Wine: jasmine.createSpyObj('Wine', ['query']),
        };
        ctrl = $controller('ListWineCtrl', params);
      });
    });

    it('should load wines', function () {
      expect(scope.wines).toBeUndefined();
      expect(params.Wine.query).toHaveBeenCalled();
    });

    it('should have a noRows method', function () {
      expect(scope.noRows).toBeDefined();
      expect(scope.noRows()).toEqual(0);
    });

    it('should not have a wine grid until it has wines', function () {
      expect(scope.wineGrid).toBeUndefined();
    });

    it('should make small thumbnails', function () {
      expect(scope.smallThumbnails).toBeDefined();
      expect(scope.smallThumbnails()).toBeUndefined();
      expect(scope.noRows()).toEqual(0);
      expect(scope.wineCls).toEqual('col-md-3');
    });

    it('should have large thumbnails method', function () {
      expect(scope.largeThumbnails).toBeDefined();
      expect(scope.largeThumbnails()).toBeUndefined();
      expect(scope.noRows()).toEqual(0);
      expect(scope.wineCls).toEqual('col-md-4');
    });

    it('should have an add wine method', function () {
      expect(scope.add).toBeDefined();
      expect(scope.add()).toBeUndefined();
    });

    it('should have a refresh method', function () {
      expect(scope.refresh).toBeDefined();
      expect(params.Wine.query.calls.count()).toEqual(1);
      expect(scope.refresh()).toBeUndefined();
      expect(params.Wine.query.calls.count()).toEqual(2);
    });
  });

  describe('EditWineCtrl', function () {
    var scope, ctrl, params;
    beforeEach(function () {
      var wine = {
        name: 'aWine',
        description: 'aDescription',
        grapeId: 1,
        $save: function () {
        }
      };
      spyOn(wine, '$save');

      var grapes = [{grapeId: 1, name: "aGrape"}];

      inject(function ($rootScope, $controller) {
        scope = $rootScope.$new();
        params = {
          $scope: scope,
          $location: jasmine.createSpyObj('$location', ['path']),
          wine: wine,
          Grape: {
            query: function () {
              return grapes
            }
          }
        };
        spyOn(params.Grape, 'query').and.callThrough();
        ctrl = $controller('EditWineCtrl', params);
      })
    });

    it('should bind the wine', function () {
      expect(scope.wine).toEqual(params.wine);
    });

    it('should start with no grape', function () {
      expect(scope.isNewGrape).toBeFalsy();
      expect(scope.grapeName).toBeNull();
    });

    it('should query grapes', function () {
      expect(params.Grape.query).toHaveBeenCalled();
    });

    it('should have a cancel method', function () {
      expect(angular.isFunction(scope.cancel)).toBe(true);
      scope.cancel();
      expect(params.$location.path).toHaveBeenCalledWith('/cellar/wines');
    });

    it('should have a submit method', function () {
      expect(angular.isFunction(scope.submit)).toBe(true);
      scope.submit();
      expect(params.wine.$save).toHaveBeenCalled();
    });

    it('should query grapes', function () {
      expect(params.Grape.query).toHaveBeenCalled();
      expect(scope.grapes.length).toBe(1);
    });

    it('should identify new grapes', function () {
      expect(scope.isNewGrape).toBe(false);
      scope.$apply(function ($scope) {
        $scope.grapeName = 'aNewGrape';
      });
      expect(scope.isNewGrape).toBeTruthy;
      scope.$apply(function ($scope) {
        $scope.grapeName = 'aGrape';
      });
      expect(scope.isNewGrape).toBeFalsy;
    })
  });

  describe('ListGrapesCtrl', function () {
    var scope, ctrl, params;
    beforeEach(function () {
      var grapes = [{grapeId: 1, name: "aGrape"}];
      inject(function ($rootScope, $controller) {
        scope = $rootScope.$new();
        params = {
          $scope: scope,
          Grape: {
            query: function () {
              return grapes
            }
          }
        };
        spyOn(params.Grape, 'query').and.callThrough();
        ctrl = $controller('ListGrapesCtrl', params);
      })
    });

    it('should bind grapes', function () {
      expect(params.Grape.query).toHaveBeenCalled();
      expect(scope.grapes.length).toEqual(1);
    });
  });
});
