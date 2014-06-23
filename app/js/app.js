var app = angular.module('verbeteApp', [
  'ngRoute',
  'ngAnimate',
  'verbeteControllers'
]);

app.config(['$routeProvider',
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

  }
]);