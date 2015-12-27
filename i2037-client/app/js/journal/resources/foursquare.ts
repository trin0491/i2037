///<reference path="../../../../typings/tsd.d.ts" />
///<reference path="../../common/services/services.ts" />

import {PathFinder} from "../../common/services/services";

    interface IVenue {

    }

    class Venue implements IVenue {
        constructor(data: any) {
            angular.extend(this, data);
        }      
    }

    class VenueResource {

      constructor(private $http:ng.IHttpService, private baseUrl:string) {}

      get(id, params):ng.IPromise<IVenue> {
          var url = this.baseUrl + id;
          return this.$http.get(url, { params: params }).then(function(rv:any) {
              var venue:Venue = new Venue(rv.data.response.venue);
              return venue;
          });        
      }
    }

export default angular.module('i2037.resources.foursquare', ['i2037.services'])

        .factory('FourSquareVenue', ['$http', 'pathFinder', 
          function($http:ng.IHttpService, pathFinder:PathFinder) {

        var baseUrl = pathFinder.get('svc/foursquare/venue/');

        return new VenueResource($http, baseUrl);
    }]);

