var verbeteControllers = angular.module('verbeteControllers', []);

verbeteControllers.controller('VerbeteListCtrl', ['$scope', '$http', function ($scope, $http) {

  $http.get('verbetes/verbetes.json').success( function (data) {
    $scope.verbetes = data;
  });

}]);


verbeteControllers.controller('VerbeteDetailCtrl', ['$scope', '$routeParams', '$http', function($scope, $routeParams, $http) {
    $http.get('verbetes/verbetes.json').success( function (data) {
	  $scope.verbeteDetail = data[$routeParams.verbeteId - 1];
	});
}]);

verbeteControllers.directive('navbar', function() {
  return {
    restrict: 'E',
    templateUrl: 'partials/navbar.html'
  };
});