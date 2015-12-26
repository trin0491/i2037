///<reference path="../../../../typings/tsd.d.ts" />

  var commentResource:ICommentResource;

  export interface IComment {
    canDelete():boolean;
    canSave():boolean;
    isNew():boolean;
    text:string;
    $save():ng.IPromise<IComment>;
    $delete():ng.IPromise<IComment>;
  }

  export interface ICommentResource {
    get(id:string, params:any): ng.IPromise<IComment>;
    save(comment:IComment):ng.IPromise<IComment>;
    delete(comment:IComment):ng.IPromise<IComment>;
    query(params:any);
  }

  export class Comment implements IComment {
    commentId:string;

    constructor(data:any) {
      angular.extend(this, data);
    }

    $save():ng.IPromise<Comment> {
      return commentResource.save(this);
    }

    $delete():ng.IPromise<Comment> {
      return commentResource.delete(this);
    }

    canDelete: () => boolean;
    canSave: () => boolean;
    isNew: () => boolean;
    text:string;
  }

  class CommentResource implements ICommentResource {

    constructor(private $http:ng.IHttpService, private baseUrl:string) { }

    private getUrl(comment) {
      return this.baseUrl + '/' + comment.commentId;
    }

    get(id:string, params:any): ng.IPromise<Comment> {
      var url = this.baseUrl + '/' + id;
      return this.$http.get(url, {params: params}).then(function (rv) {
        var comment = new Comment(rv.data);
        return comment;
      });
    }

    save(comment:Comment):ng.IPromise<Comment> {
      var url = this.baseUrl;
      if (comment.commentId) {
        url = url + '/' + comment.commentId;
      }
      return this.$http.post(url, comment);
    }

    delete(comment:Comment):ng.IPromise<Comment> {
      var url = this.getUrl(comment);
      return this.$http.delete(url);
    }

    query(params:any) {
      return this.$http.get(this.baseUrl, {params: params}).then(function (response) {
        var comments = [];
        angular.forEach(response.data, function (commentData) {
          comments.push(new Comment(commentData));
        });
        return comments;
      });
    }
  }

  export default angular.module('i2037.resources.comments', ['i2037.services'])

    .factory('Comment', ['$http', 'pathFinder', function ($http:ng.IHttpService, pathFinder) {

      var baseUrl = pathFinder.get('svc/comments');

      commentResource = new CommentResource($http, baseUrl);

      return commentResource;
    }])
  ;

