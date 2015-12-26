
  interface IRecipesScope extends ng.IScope { }

export default angular.module('i2037.recipes', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider:ng.route.IRouteProvider) {
      $routeProvider.when('/recipes', {templateUrl: 'partials/recipes.html', controller: 'RecipesCtrl'});
    }])

    .controller('RecipesCtrl', ['$scope', function ($scope) {

    }]);
