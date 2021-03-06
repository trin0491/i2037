///<reference path="../../../../typings/tsd.d.ts" />

import services from "../../common/services/services";

export class Journal {

  private pad(n) {
    return n < 10 ? '0' + n : n;
  }

  toDateString(dt) {
    var y = dt.getFullYear().toString();
    var m = this.pad(dt.getMonth() + 1).toString();
    var d = this.pad(dt.getDate()).toString();
    return y + m + d;
  }

  toDate(str) {
    var r = /(\d{4})(\d{2})(\d{2})/;
    var matches = r.exec(str);
    var d = new Date();
    d.setUTCFullYear(+matches[1]);
    var month = +matches[2] - 1; // Careful, month starts at 0!
    var day = +matches[3];
    d.setUTCMonth(month, day);
    d.setUTCHours(0);
    d.setUTCMinutes(0);
    d.setUTCSeconds(0);
    return d;
  }

}


export class MovesProfile {

  redirectTo:string;

  constructor(data:any) {
    angular.extend(this, data);
  }
}

export interface IMovesProfileResource {
  get(params:any): ng.IPromise<MovesProfile>;
}

class MovesProfileResource implements IMovesProfileResource {
  constructor(private $http:ng.IHttpService, private url:string) {
  }

  get(params):ng.IPromise<MovesProfile> {
    return this.$http.get(this.url, {params: params}).then(function (response) {
      var profile = new MovesProfile(response.data);
      return profile;
    });
  }
}

export class DaySummary {
  constructor(data:any) {
    angular.extend(this, data);
  }
}

export interface IJournalSummaryResource {
  query(params): ng.IPromise<DaySummary[]>;
  get(params): ng.IPromise<DaySummary>;
}

class JournalSummaryResouce implements IJournalSummaryResource {

  constructor(private $http:ng.IHttpService, private url:string, private journal:Journal) {
  }

  query(params) {
    params['from'] = this.journal.toDateString(params['from']);
    params['to'] = this.journal.toDateString(params['to']);
    return this.$http.get(this.url, {params: params}).then(function (response) {
      var days = [];
      angular.forEach(response.data, function (day) {
        days.push(new DaySummary(day));
      });
      return days;
    });
  }

  get(params) {
    params['date'] = this.journal.toDateString(params['date']);
    return this.$http.get(this.url + '/' + params['date']).then(function (response) {
      if (response.data) {
        return new DaySummary(response.data);
      }
    });
  }
}

export class Places {
  constructor(data) {
    angular.extend(this, data);
  }
}

export interface IPlaceResource {
  get(params): ng.IPromise<Places>;
}

class PlaceResource implements IPlaceResource {

  constructor(private $http:ng.IHttpService, private url:string, private journal:Journal) {
  }

  get(params):ng.IPromise<Places> {
    var dateStr = this.journal.toDateString(params['date']);
    return this.$http.get(this.url + dateStr).then(function (response) {
      var places = new Places(response.data);
      return places;
    });
  }
}

export class PhotoSummary {
  constructor(data) {
    angular.extend(this, data);
  }
}

export interface IPhotoSummaryResource {
  query(params): ng.IPromise<PhotoSummary>;
}

class PhotoSummaryResource implements IPhotoSummaryResource {

  constructor(private $http:ng.IHttpService, private url:string, private journal:Journal) {
  }

  query(params):ng.IPromise<PhotoSummary> {
    var dateStr = this.journal.toDateString(params['date']);
    return this.$http.get(this.url + dateStr).then(function (response:ng.IHttpPromiseCallbackArg<any>) {
      var photos = [];
      angular.forEach(response.data.photos.photo, function (photo) {
        photos.push(new PhotoSummary(photo));
      });
      return photos;
    });
  }
}

export class Storyline {
  constructor(data) {
    angular.extend(this, data);
  }
}

export interface IStorylineResource {
  query(params): ng.IPromise<Storyline[]>;
}

class StorylineResource implements IStorylineResource {
  constructor(private $http:ng.IHttpService, private url:string, private journal:Journal) {
  }

  query(params):ng.IPromise<Storyline[]> {
    var dateStr = this.journal.toDateString(params['date']);
    return this.$http.get(this.url + dateStr).then(function (response) {
      var storylines = [];
      angular.forEach(response.data, function (day) {
        storylines.push(new Storyline(day));
      });
      return storylines;
    });
  }
}

export default angular.module('i2037.resources.journal', [services.name])

  .factory('Journal', function JournalFactory() {
    var journal:Journal = new Journal();
    return journal;
  })

  .factory('MovesProfile', ['$http', 'pathFinder', function ($http:ng.IHttpService, pathFinder) {
    var url = pathFinder.get('svc/moves/user/profile');
    var resource:IMovesProfileResource = new MovesProfileResource($http, url);
    return resource;
  }])

  .factory('JournalSummary', ['$http', 'pathFinder', 'Journal', function ($http, pathFinder, Journal) {
    var url = pathFinder.get('svc/timeline/summary/daily');
    var resource:JournalSummaryResouce = new JournalSummaryResouce($http, url, Journal);
    return resource;
  }])

  .factory('MovesPlaces', ['$http', 'pathFinder', 'Journal', function ($http, pathFinder, Journal) {
    var url = pathFinder.get('svc/moves/user/places/daily/');
    var resource:PlaceResource = new PlaceResource($http, url, Journal);
    return resource;
  }])

  .factory('PhotoSummary', ['$http', 'pathFinder', 'Journal',
    function PhotoSummaryFactory($http:ng.IHttpService, pathFinder, Journal:Journal) {
      var url = pathFinder.get('svc/photos/daily/');
      var rsrc:IPhotoSummaryResource = new PhotoSummaryResource($http, url, Journal)
      return rsrc;
    }])

  .factory('JournalStoryline', ['$http', 'pathFinder', 'Journal', function ($http, pathFinder, Journal) {

    var url = pathFinder.get('svc/timeline/daily/');

    var rsrc:IStorylineResource = new StorylineResource($http, url, Journal);
    return rsrc;
  }]);
