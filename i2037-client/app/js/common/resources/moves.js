
angular.module('i2037.resources.moves', ['i2037.services'])

.factory('MovesProfile', function($resource, pathFinder) {
    return $resource(pathFinder.get('svc/moves/user/profile'));
})

.factory('MovesSummary', function($resource, pathFinder) {
    return $resource(pathFinder.get('svc/moves/user/summary/daily/:date'));
})

.factory('MovesPlaces', function($resource, pathFinder) {
    return $resource(pathFinder.get('svc/moves/user/places/daily/:date'));
})

.factory('MovesStoryline', function($resource, pathFinder) {
    return $resource(pathFinder.get('svc/moves/user/storyline/daily/:date'));
});