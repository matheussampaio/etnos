(function() {
    'use strict';

    var DEBUG_MODE = true;

    // gulp-inject-debug-mode

    angular.module('EtnosApp')
        .constant('EtenosAppDebug', DEBUG_MODE)
        .config(EtnosApp);

    function EtnosApp($routeProvider) {

        $routeProvider.when('/home', {
            templateUrl: 'home/home.html',
            controller: 'VerbeteListController',
            controllerAs: 'vlCtrl',
        });

        $routeProvider.when('/home/apresentacao', {
            templateUrl: 'home/apresentacao.html',
        });

        $routeProvider.when('/home/fichatecnica', {
            templateUrl: 'home/fichatecnica.html',
        });

        $routeProvider.when('/home/catalogo', {
            templateUrl: 'home/catalogo.html',
        });

        $routeProvider.when('/home/help', {
            templateUrl: 'home/help.html',
        });

        $routeProvider.when('/verbete/:verbeteId', {
            templateUrl: 'verbete-detail/verbete-detail.html',
            controller: 'VerbeteDetailController',
        });

        $routeProvider.otherwise({
            redirectTo: '/home',
        });

    }

})();
