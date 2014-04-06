(function() {
  'use strict';

angular.module('i2037.directives.map', [])

.directive('i2Map', function() {
  return {
    scope: {
      places: '=i2Places',
      paths: '=i2Paths',
      selected: '=i2Selected'
    },

    replace: false,

    link: function(scope, element, attrs) {
      // TODO pass in styles
      var colours = {
        'walking': '#808080',
        'running': '#FF85D6',    
        'cyclying': '#3399FF',
        'transport': '#585858'
      };

      var infoWindow = new google.maps.InfoWindow();
      var map;
      var polylines = [];
      var markers = [];

      function setupMap() {
        element.addClass('i2-map');

        var mapOptions = {
          center: new google.maps.LatLng(51.46044, -0.29745),
          zoom: 12,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        map = new google.maps.Map(
          element.get(0),
          mapOptions
        );
      }

      function getLatLng(place) {
        var lat = place.lat;
        var lon = place.lon;
        return new google.maps.LatLng(lat, lon);  
      }

      function addMarker(place) {
        var loc = getLatLng(place);
        var name = place.name ? place.name : "Unknown";

        var marker = new google.maps.Marker({
            position: loc,
            map: map,
            title: name
        });

        google.maps.event.addListener(marker, 'click', function() {
          scope.onMarkerClick(marker, place);
        });

        markers.push(marker);
      }

      function addPolyLine(path) {
        var points = [];
        var trackPoints = path.trackPoints;
        for (var t in trackPoints) {
          points.push(
            new google.maps.LatLng(trackPoints[t].lat, trackPoints[t].lon)
          );
        }

        var polyline = new google.maps.Polyline({
          path: points,
          strokeColor: colours[path.group],
          strokeOpacity: 1.0,
          strokeWeight: 2
        });

        polylines.push(polyline);
        polyline.setMap(map);      
      }

      function setCenter(place) {
        var latlng = getLatLng(place);
        map.setCenter(latlng);
      }

      scope.onMarkerClick = function(marker, place) {
          scope.$apply(function(scope) {
            scope.selected = place;
          });        
          // var contentStr = '<div ng-include="\'partials/moves-place.html\'"></div>';
          // var elements = $compile(contentStr)(scope);      
          // infoWindow.setContent(elements[0]);
          // infoWindow.open(map, marker);        
      };

      scope.$watch('places', function(newPlaces, oldPlaces) {
        for (var i in markers) {
          markers[i].setMap(null);
        }
        markers.length = 0;
        for (var n in newPlaces) {
          addMarker(newPlaces[n]);
        }
      });

      scope.$watch('paths', function(newPaths, oldPaths) {
        for (var p in polylines) {
          polylines[p].setMap(null);
        }
        polylines.length = 0;
        for (var n in newPaths) {
          addPolyLine(newPaths[n]);
        }
      });

      scope.$watch('selected', function(newSelected, oldSeleted) {
        if (newSelected) {
          setCenter(newSelected);        
        }
      });

      setupMap();
    }
  };
})
;

}());
