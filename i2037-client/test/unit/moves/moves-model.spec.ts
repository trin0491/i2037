import model from "../../../app/js/moves/moves-model";

describe('i2037.moves.model', function () {
  beforeEach(function () {
    angular.mock.module(model.name);
  })

  describe('MovesPlacesModel', function () {
    var model, $rootScope, place;

    beforeEach(function () {
      inject(function (_MovesPlacesModel_, _$rootScope_) {
        model = _MovesPlacesModel_;
        $rootScope = _$rootScope_;
      })
      place = {name: 'aPlace', location: {lat: 1.0, lon: 1.2}};
      spyOn($rootScope, '$broadcast');
    });

    it('should initially be empty', function () {
      expect(model.getPlaces().length).toBe(0);
    });

    it('should broadcast collection change event', function () {
      var places = [place];
      model.setPlaces(places);
      expect($rootScope.$broadcast)
        .toHaveBeenCalledWith('MovesPlacesModel::CollectionChange', model);
      expect(model.getPlaces()).toBe(places);
    });

    it('should broadcast selection change event', function () {
      model.setSelected(place);
      expect($rootScope.$broadcast)
        .toHaveBeenCalledWith('MovesPlacesModel::SelectedChange', model);
      expect(model.getSelected()).toBe(place);
    });

    it('should not raise selection change if it hasnot changed', function () {
      model.setSelected(place);
      model.setSelected(place);
      expect($rootScope.$broadcast.call.length).toBe(1);
    });
  });

  describe('MovesPathsModel', function () {
    var model, $rootScope, path;

    beforeEach(function () {
      inject(function (_MovesPathsModel_, _$rootScope_) {
        model = _MovesPathsModel_;
        $rootScope = _$rootScope_;
      })
      path = {name: 'aPath', trackPoints: {lat: 1.0, lon: 1.2}};
      spyOn($rootScope, '$broadcast');
    });

    it('should initially be empty', function () {
      expect(model.getPaths().length).toBe(0);
    });

    it('should broadcast collection change event', function () {
      var paths = [path];
      model.setPaths(paths);
      expect($rootScope.$broadcast)
        .toHaveBeenCalledWith('MovesPathsModel::CollectionChange', model);
      expect(model.getPaths()).toBe(paths);
    });

  });
});