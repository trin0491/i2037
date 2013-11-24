angular.module('i2037.moves', [
  'ngRoute',
  'i2037.resources.moves',
  'i2037.resources.foursquare',
  'i2037.resources.comments',
  'i2037.moves.model',
  'i2037.directives.map',
  'i2037.directives.timeline',
  'i2037.directives.spinner',
  'i2037.directives.button'
])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/journal', {
    templateUrl: 'partials/journal-calendar.html',
    controller: 'JournalCtrl',
    resolve: {
      movesProfile: ['$route', 'MovesProfile', function($route, MovesProfile) {
        return MovesProfile.get($route.current.params).then(function (profile) {
            if (profile.redirectTo) {
              window.location.replace(profile.redirectTo);
            } else {
              return profile;
            }
        });
      }],
      date: function() {
        return new Date();
      } 
    }
  });
  $routeProvider.when('/journal/date/:date', {
    templateUrl: 'partials/journal-date.html',
    controller: 'JournalCtrl',
    resolve: {
      date: ['$route', 'Moves', function($route, Moves) { 
        return Moves.toDate($route.current.params.date); 
      }] 
    }
  });    
}])

.controller('JournalCtrl', ['$scope', '$rootScope', 'date', 'MovesStoryline', 'MovesPlacesModel', 'MovesPathsModel',
 function($scope, $rootScope, date, MovesStoryline, MovesPlacesModel, MovesPathsModel) {
  
  $scope.date = date;

  function processResponse(storylines) {
    var places = [];
    var paths = [];

    for (var day=0;day<storylines.length;day++) {
      var segments = storylines[day].segments;
      for (var s=0;s<segments.length;s++) {
        if (segments[s].type === 'place') {
          var place = segments[s].place;
          place.startTime = segments[s].startTime;
          place.endTime = segments[s].endTime;
          places.push(place);
        } else if (segments[s].type === 'move') {
          for (var a in segments[s].activities) {
            var activity = segments[s].activities[a];
            paths.push(activity);
          }
        }       
      }
    }
    MovesPlacesModel.setPlaces(places);
    MovesPathsModel.setPaths(paths);    
  }

  function loadStoryLine(dt) {
    return MovesStoryline.query({date: dt}).then(function(storylines) {
      processResponse(storylines);
    });
  }

  function onDateChanged(date) {
    $rootScope.$broadcast('MovesDataLoading');
    var p = loadStoryLine(date).then(function (storyLine) {
      $rootScope.$broadcast('MovesDataLoaded');      
    }, function(error) {
      $rootScope.$broadcast('MovesDataLoaded');
    });
  }

  onDateChanged(date);
}])

.controller('DatePickerCtrl', ['$scope', '$timeout', '$location', 'Moves', function ($scope, $timeout, $location, Moves) {
  $scope.dt = $scope.date;  
  $scope.minDate = '2000-01-01';
  $scope.maxDate = new Date();
  $scope.showWeeks = true;
  $scope.dateOptions = {
    'year-format': "'yy'",
    'starting-day': 1
  };

  $scope.disabled = function(date, mode) {
    return false; 
  };

  $scope.open = function() {
    $timeout(function() {
      $scope.opened = true;
    });
  };

  $scope.submit = function() {
    if ($scope.dt) {
      $location.path('/journal/date/'+ Moves.toDateString($scope.dt));          
    }
  };

  $scope.$on('MovesDataLoading', function() {
    $scope.state = 'LOADING';
  });

  $scope.$on('MovesDataLoaded', function() {
    $scope.state = 'default';
  });
}])

.controller('MovesSummaryCtrl', ['$scope', 'Moves', 'MovesSummary', function($scope, Moves, MovesSummary) {
  // date change is no longer raised  
  $scope.$on('DateChanged', function(event, date) {
    var dateStr = Moves.toDateString(date);
    MovesSummary.get({date: dateStr}).then(function(summary) {
      $scope.summary = summary;
    });
  });
}])

.controller('TimelineCtrl', ['$scope', 'MovesPlacesModel', function($scope, MovesPlacesModel) {

  function toDate(str) {
      var r = /(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z/;
      var matches = r.exec(str);
      var d = new Date();
      d.setUTCFullYear(+matches[1]);
      d.setUTCMonth(+matches[2]-1); // Careful, month starts at 0!
      d.setUTCDate(+matches[3]);
      d.setUTCHours(+matches[4]);
      d.setUTCMinutes(+matches[5]);
      d.setUTCSeconds(+matches[6]);
      return d;    
  }

  $scope.$on('MovesPlacesModel::CollectionChange', function(event, model) {
    var entries = [];
    var places = model.getPlaces();
    for (var i in places) {
      var place = places[i];
      var entry = { 
        date: toDate(places[i].startTime), 
        text: place.name,
        place: place,
        comments: []
      };
      entries.push(entry);          
    }
    $scope.entries = entries;
  });

  $scope.$on('MovesPlacesModel::SelectedChange', function(e, model) {
    var selectedPlace = model.getSelected();
    if ($scope.entries) {
      for (var i=0;i<$scope.entries.length;++i) {
        if ($scope.entries[i].place === selectedPlace) {
          $scope.selected = $scope.entries[i];        
        }
      }      
    }
  });

  $scope.$watch('selected', function(newSelection, oldSelection) {
    if (newSelection) {
      MovesPlacesModel.setSelected(newSelection.place);      
    } else {
      MovesPlacesModel.setSelected(undefined);
    }
  });

}])

.controller('TimelineEntryCtrl', ['$scope', 'FourSquareVenue', 'Comment', function($scope, FourSquareVenue, Comment) {
  $scope.isCollapsed = true;
  $scope.showSpinner = false;
 
  var CommentPM = function CommentPM(comment) {
    this.model = comment;
    this.img = 'https://pbs.twimg.com/profile_images/1411601479/2600_joystick_45_normal.jpg';
    this.author =  'Richard Priestley'; 
    this.text = comment.text;
    this.lastUpdateTime = comment.lastUpdateTime;
    this.isNew = function() {
      return this.model.commentId === undefined;
    };

    this.canDelete = function() {
      return ! this.isNew();
    };

    this.canSave = function() {
      return true;
    };
  };  

  function loadComments(entry) {
    return Comment.query({entryId: 'abc'}).then(function(comments) {
      return comments.map(function(comment){ 
        return new CommentPM(comment);
      });
    });
  }

  function loadVenue(foursquareId) {
    return FourSquareVenue.get(foursquareId).then(function(fsqVenue) {
      var venue = {
        type: 'Foursquare',
        phone: fsqVenue.contact.phone,
        formattedPhone: fsqVenue.contact.formattedPhone,
        canonicalUrl: fsqVenue.canonicalUrl,
        url: fsqVenue.url
      };
      var location = fsqVenue.location;
      if (location) {
        var properties = ['address', 'city', 'state', 'postalCode', 'country'];
        var lines = properties.map(function(p) { if (location.hasOwnProperty(p)) {return location[p];} });
        venue.address = lines.join(', ');
      }
      return venue; 
    });           
  }

  $scope.toggleCollapse = function(entry) {
    $scope.isCollapsed = !$scope.isCollapsed;
    if(entry.place.type === 'foursquare') {
      if (!entry.venue) {
        $scope.showSpinner = true;        
        loadVenue(entry.place.foursquareId).then(function(venue) {
          entry.venue = venue;
          $scope.showSpinner = false;          
        }, function(error) {
          $scope.showSpinner = false;
        });
      }        
    } else {
      entry.venue = {
        type: 'Moves'
      };
    }
    loadComments(entry).then(function(comments) {
      entry.comments = comments;
    });
  };

  function newComment() {
    var comment = new Comment();
    $scope.newComment = new CommentPM(comment);
  }
  newComment();

  $scope.addComment = function(entry) {
    $scope.newComment.model.$save().then(function() {
      loadComments(entry).then(function(comments) {
        entry.comments = comments;
      });
      newComment();
    });
  };

  $scope.deleteComment = function(entry, comment) {
    comment.model.$delete().then(function() {
      loadComments(entry).then(function(comments) {
        entry.comments = comments;
      });
    });
  };
}])

.controller('MovesMapCtrl', ['$scope', 'MovesPlacesModel', function($scope, MovesPlacesModel) {
  $scope.$on('MovesPlacesModel::CollectionChange', function(e, model) {
    $scope.places = model.getPlaces();
  });

  $scope.$on('MovesPathsModel::CollectionChange', function(e, model) {
    $scope.paths = model.getPaths();
  });

  $scope.$on('MovesPlacesModel::SelectedChange', function(e, model) {
    $scope.selected = model.getSelected();
  });

  $scope.$watch('selected', function(newSelection, oldSelection) {
    if (newSelection) {
      MovesPlacesModel.setSelected(newSelection);
    } else {
      MovesPlacesModel.setSelected(undefined);
    }
  });
}])

;
