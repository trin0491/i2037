angular.module('i2037.journal.date', [
  'i2037.resources.journal',
  'i2037.resources.foursquare',
  'i2037.resources.comments',
  'i2037.moves.model',
  'i2037.directives.map',
  'i2037.directives.timeline',
  'i2037.directives.spinner',
  'i2037.directives.button',
  'i2037.directives.comment',
  'journal/journal-date.tpl.html'
])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/journal/date/:date', {
    templateUrl: 'journal/journal-date.tpl.html',
    controller: 'JournalCtrl',
    resolve: {
      date: ['$route', 'Journal', function($route, Journal) { 
        return Journal.toDate($route.current.params.date); 
      }] 
    }
  });      
}])

.controller('JournalCtrl', ['$scope', '$rootScope', 'date', 'JournalStoryline', 'MovesPlacesModel', 'MovesPathsModel',
 function($scope, $rootScope, date, JournalStoryline, MovesPlacesModel, MovesPathsModel) {
  
  $scope.date = date;

  function processResponse(storylines) {
    var places = [];
    var paths = [];

    for (var entry=0;entry<storylines.length;entry++) {
      var payload = storylines[entry].payload;
      if (payload.type === 'place') {
        places.push(storylines[entry]);
      } else if (payload.type === 'move') {
        for (var a in payload.activities) {
          var activity = payload.activities[a];
          paths.push(activity);
        }
      }       
    }
    MovesPlacesModel.setPlaces(places);
    MovesPathsModel.setPaths(paths);    
  }

  function loadStoryLine(dt) {
    return JournalStoryline.query({date: dt}).then(function(storylines) {
      processResponse(storylines);
    });
  }

  function onDateChanged(date) {
    $rootScope.$broadcast('Resource::Loading', 'MOVES');
    var p = loadStoryLine(date).then(function (storyLine) {
      $rootScope.$broadcast('Resource::Loaded', 'MOVES');      
    }, function(response) {
      var msg = 'Failed to load timeline: status: ' + response.status + ' data: ' + response.data;
      $rootScope.$broadcast('Resource::LoadingError', 'MOVES', msg);
    });
  }

  onDateChanged(date);
}])

.controller('DatePickerCtrl', ['$scope', '$timeout', '$location', 'Journal', function ($scope, $timeout, $location, Journal) {
  $scope.dt = $scope.date;  
  $scope.minDate = '2000-01-01';
  $scope.maxDate = new Date();
  $scope.showWeeks = true;
  $scope.dateOptions = {
    'year-format': "'yy'",
    'starting-entry': 1
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
      $location.path('/journal/date/'+ Journal.toDateString($scope.dt));          
    }
  };

}])

.controller('TimelineCtrl', ['$scope', 'MovesPlacesModel', function($scope, MovesPlacesModel) {

  var PlacePM = function(entry) {
    this.entry = entry;
    this.refId = entry.refId;
    this.type = entry.type; 
    this.date = new Date(entry.time); 
    this.text = entry.payload.place.name;
    this.place = entry.payload.place;
    this.comments = [ ];

    var end = new Date(entry.endTime);
    this.duration = end - this.date;
  };

  $scope.$on('MovesPlacesModel::CollectionChange', function(event, model) {
    var placePMs = [];
    var places = model.getPlaces();
    for (var i in places) {
      var placePM = new PlacePM(places[i]);
      placePMs.push(placePM);          
    }
    $scope.entries = placePMs;
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
      MovesPlacesModel.setSelected(newSelection.entry);      
    } else {
      MovesPlacesModel.setSelected(undefined);
    }
  });

}])

.controller('DailyStatisticsCtrl', ['$scope', 'd3Service', 'Journal', 'JournalSummary', function($scope, d3Service, Journal, JournalSummary) {
  var d3 = d3Service.d3();
  $scope.colours = ['#5CADFF', '#3399FF', '#297ACC', '#1F5C99'];
  $scope.activities = [];
  $scope.distance = "0m";

  var colour = d3.scale.ordinal().range($scope.colours);
  $scope.getColour = function(index) {
    return colour(index);
  };

  JournalSummary.get({date: $scope.date}).then(function(summary) {
    $scope.activities = summary.activities;
    $scope.distance = d3.sum($scope.activities.map(function(a) { return a.distance;})) + 'm';  
  });
}])

.controller('TimelineEntryCtrl', ['$scope', '$rootScope', 'FourSquareVenue', 'Comment', function($scope, $rootScope, FourSquareVenue, Comment) {
  $scope.isEntryLoading = false;
 
  var CommentPM = function(comment) {
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
    return Comment.query({refId: entry.refId, entryType: entry.type}).then(function(comments) {
      return comments.map(function(comment){ 
        return new CommentPM(comment);
      });
    }, function(response) {
      var msg = 'Failed to load comments: status: ' + response.status;
      $rootScope.$broadcast('Resource::LoadingError', 'COMMENT', msg);        
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

  function load(entry) {
    if(entry.place.type === 'foursquare') {
      if (!entry.venue) {
        $scope.isEntryLoading = true;        
        loadVenue(entry.place.foursquareId).then(function(venue) {
          entry.venue = venue;
          $scope.isEntryLoading = false;          
        }, function(error) {
          $scope.isEntryLoading = false;
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
  }
 
  function newComment() {
    var comment = new Comment();
    $scope.newComment = new CommentPM(comment);
  }

  $scope.saveComment = function(commentPM, entry) {
    var comment = commentPM.model;
    comment.text = commentPM.text;
    comment.refId = entry.refId;
    comment.entryType = entry.type;

    comment.$save().then(function() {
      loadComments(entry).then(function(comments) {
        entry.comments = comments;
      });      
    }, function(response) {
      var msg = 'Failed to save comment: status: ' + response.status;
      $rootScope.$broadcast('Resource::SaveError', 'COMMENT', msg);
    });
    newComment();    
  };

  $scope.deleteComment = function(comment, entry) {
    comment.model.$delete().then(function() {
      loadComments(entry).then(function(comments) {
        entry.comments = comments;
      });
    }, function(response) {
      var msg = 'Failed to delete comment: status: ' + response.status;
      $rootScope.$broadcast('Resource::DeleteError', 'COMMENT', msg);      
    });
  };

  load($scope.entry);
  newComment();  
}])

.controller('MovesMapCtrl', ['$scope', 'MovesPlacesModel', function($scope, MovesPlacesModel) {

  function PlacePM(entry) {
    this.name = entry.payload.place.name;
    this.lat = entry.payload.place.location.lat;
    this.lon = entry.payload.place.location.lon;    
  }

  $scope.$on('MovesPlacesModel::CollectionChange', function(e, model) {
    $scope.places = model.getPlaces().map(function(place) {
      return new PlacePM(place);
    });
  });

  $scope.$on('MovesPathsModel::CollectionChange', function(e, model) {
    $scope.paths = model.getPaths();
  });

  $scope.$on('MovesPlacesModel::SelectedChange', function(e, model) {
    var place = model.getSelected();
    if (place) {
      $scope.selected = new PlacePM(place);   
    } else {
      $scope.selected = null;
    }
  });
}])

;
