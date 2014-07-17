var convert = require('./js/convert');

var verbeteControllers = angular.module('verbeteControllers', []);

verbeteControllers.controller('VerbeteListCtrl', ['$scope', '$http', function ($scope, $http) {

  $http.get('verbetes/verbetes.json').success( function (data) {
    $scope.verbetes = data;
  });

}]);


verbeteControllers.controller('VerbeteDetailCtrl', ['$scope', '$routeParams', '$http', function($scope, $routeParams, $http) {
  $http.get('verbetes/verbetes.json').success( function (data) {

    $scope.verbeteDetail = data[$routeParams.verbeteId - 1];

    convert.convertVerbete(data[$routeParams.verbeteId - 1]).done(function (results) {
      $scope.verbeteDetail.converted = results;
      $scope.$apply();
      console.log('scope', $scope.verbeteDetail);
    }, function (err) {
      console.error(err);
    });

    // $scope.verbeteDetail = data[$routeParams.verbeteId - 1];

    console.log('scope', $scope.verbeteDetail);
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