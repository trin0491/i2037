angular.module('i2037.recipes', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/recipes', {templateUrl: 'partials/recipes.html', controller: 'RecipesCtrl'})
}])

.controller('RecipesCtrl', ['$scope', function ($scope) {
}]);
