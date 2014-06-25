angular.module('i2037.resources.comments', ['i2037.services'])

.factory('Comment', ['$http', 'pathFinder', function($http, pathFinder) {

  var baseUrl = pathFinder.get('svc/comments');

  function getUrl(comment) {
    return baseUrl + '/' + comment.commentId;
  }

  // constructor
  var Comment = function(data) {
    angular.extend(this, data);
  };

  // statics
  Comment.get = function(id, params) {
    var url = baseUrl + '/' + id;
    return $http.get(url, { params: params }).then(function(rv) {
      var comment = new Comment(rv.data);
      return comment;
    });
  };

  Comment.save = function(comment) {
    var url = baseUrl;
    if (comment.commentId) {
      url = url + '/' + comment.commentId;
    }
    return $http.post(url, comment);
  };

  Comment.delete = function(comment) {
    var url = getUrl(comment);
    return $http.delete(url);
  };

  Comment.query = function(params) {
    var url = baseUrl;
    return $http.get(url, {params: params}).then(function (response) {
      var comments = [];
      angular.forEach(response.data, function(commentData) {
        comments.push(new Comment(commentData));
      });
      return comments; 
    });
  };

  // instance methods
  Comment.prototype.$save = function() {
    return Comment.save(this);
  };

  Comment.prototype.$delete = function() {
    return Comment.delete(this);
  };

  return Comment;
}])

;