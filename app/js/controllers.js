var verbeteControllers = angular.module('verbeteControllers', []);

verbeteControllers.controller('VerbeteListCtrl', ['$scope', '$http', function ($scope, $http) {

  $http.get('verbetes/verbetes.json').success( function (data) {
    $scope.verbetes = data;
  });

}]);


verbeteControllers.controller('VerbeteDetailCtrl', ['$scope', '$routeParams',
  function($scope, $routeParams) {
    $scope.verbeteId = $routeParams.verbeteId;
}]);
