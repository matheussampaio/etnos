var convert = require('./js/convert');

var verbeteControllers = angular.module('verbeteControllers', ['angular-carousel']);


verbeteControllers.controller('VerbeteListCtrl', ['$scope', '$http', function ($scope, $http) {

  $http.get('verbetes/verbetes.json').success( function (data) {
    $scope.verbetes = data;
  });

  // $.removeData(image, 'elevateZoom');//remove zoom instance from image

}]);


verbeteControllers.controller('VerbeteDetailCtrl', ['$scope', '$routeParams', '$http', function($scope, $routeParams, $http) {
  $http.get('verbetes/verbetes.json').success( function (data) {

    $scope.verbeteDetail = data[$routeParams.verbeteId - 1];

    convert.convertVerbete(data[$routeParams.verbeteId - 1]).done(function (results) {
      $scope.verbeteDetail.converted = results;
      $scope.$apply();
    }, function (err) {
      console.error(err);
    });

    $scope.removeZoomContainer = function() {
      console.log("Removing zoom containers...");

      $('.zoomContainer').remove();
    }
  });
}]);


verbeteControllers.directive('navbar', function() {
  return {
    restrict: 'E',
    templateUrl: 'partials/navbar.html'
  };
});


verbeteControllers.directive('trianglify', ['$window', function($window) {
    return function(scope, element, attr) {

      var t = new Trianglify();
      var pattern = t.generate(2500, 1500);

      element.css({
       backgroundImage: pattern.dataUrl
      });

    };
}]);

verbeteControllers.directive('phResizable', ['$window', function($window) {
  return function($scope) {
    $scope.initializeWindowSize = function() {
      $scope.windowHeight = $window.innerHeight;
      return $scope.windowWidth = $window.innerWidth;
    };
    $scope.initializeWindowSize();
    return angular.element($window).bind('resize', function() {
      $scope.initializeWindowSize();
      return $scope.$apply();
    });
  };
}]);

verbeteControllers.directive('phElevateZoom', function() {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      element.attr('data-zoom-image',attrs.zoomImage);
      $(element).elevateZoom({
        scrollZoom : true,
        //zoomType  : "inner",
         zoomType   : "lens",
        lensShape : "round",
        lensSize : 200,
        zoomWindowFadeIn: 500,
        lensFadeIn: 500
      });
    }
  };
});