///<reference path="../../../typings/tsd.d.ts" />

module i2037.moves.model {
  angular.module('i2037.moves.model', ['i2037.resources.journal'])

  .service('MovesPlacesModel', ['$rootScope', function($rootScope:ng.IRootScopeService) {
    var places = [];
    var selected;

    this.setPlaces = function(list) {
      places = list;
      $rootScope.$broadcast('MovesPlacesModel::CollectionChange', this);
    };

    this.getPlaces = function() {
      return places;
    };

    this.getSelected = function() {
      return selected;
    };

    this.setSelected = function(place) {
      var hasChanged = (selected !== place);
      selected = place;
      if (hasChanged) {
        $rootScope.$broadcast('MovesPlacesModel::SelectedChange', this);    
      }
    };

    return this;
    }])

  .service('MovesPathsModel', ['$rootScope', function($rootScope) {
    var paths = [];

    this.setPaths = function(list) {
      paths = list;
      $rootScope.$broadcast('MovesPathsModel::CollectionChange', this);    
    };

    this.getPaths = function() {
      return paths;
    };
    }])
  ;
}