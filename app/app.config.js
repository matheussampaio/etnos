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
            controller: 'HomeController',
            controllerAs: 'vlCtrl',
        });

        $routeProvider.when('/infos/apresentacao', {
            templateUrl: 'infos/content/apresentacao.html',
            controller: 'InfosController',
            controllerAs: 'vlCtrl',
        });

        $routeProvider.when('/infos/fichatecnica', {
            templateUrl: 'infos/content/fichatecnica.html',
            controller: 'InfosController',
            controllerAs: 'vlCtrl',
        });

        $routeProvider.when('/infos/catalogo', {
            templateUrl: 'infos/content/catalogo.html',
            controller: 'InfosController',
            controllerAs: 'vlCtrl',
        });

        $routeProvider.when('/infos/help', {
            templateUrl: 'infos/content/help.html',
            controller: 'InfosController',
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
