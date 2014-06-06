var verbeteApp = angular.module('verbeteApp', [
  'ngRoute',
  'verbeteControllers'
]);

verbeteApp.config(['$routeProvider',
  function ($routeProvider) {
    $routeProvider.when('/verbetes', {
      templateUrl: 'partials/verbete-list.html',
      controller: 'VerbeteListCtrl'
    }).
    when('/verbete/:verbeteId', {
      templateUrl: 'partials/verbete-detail.html',
      controller: 'VerbeteDetailCtrl'
    }).
    otherwise({
      redirectTo: '/verbetes'
    });

  }]);

verbeteApp.controller('VerbeteListCtrl', ['$scope', '$http', function ($scope, $http) {

  $http.get('verbetes/verbetes.json').success( function (data) {
    $scope.verbetes = data;
  });

}]);