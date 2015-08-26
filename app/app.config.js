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
            controller: 'VerbeteListController',
            controllerAs: 'vlCtrl',
        });

        $routeProvider.when('/home/fichatecnica', {
            templateUrl: 'home/fichatecnica.html',
            controller: 'VerbeteListController',
            controllerAs: 'vlCtrl',
        });

        $routeProvider.when('/home/catalogo', {
            templateUrl: 'home/catalogo.html',
            controller: 'VerbeteListController',
            controllerAs: 'vlCtrl',
        });

        $routeProvider.when('/home/help', {
            templateUrl: 'home/help.html',
            controller: 'VerbeteListController',
            controllerAs: 'vlCtrl',
        });

        $routeProvider.when('/verbete/:verbeteId', {
            templateUrl: 'verbete-detail/verbete-detail.html',
            controller: 'VerbeteDetailController',
            controllerAs: 'vdCtrl',
        });

        $routeProvider.otherwise({
            redirectTo: '/home',
        });

    }

})();
