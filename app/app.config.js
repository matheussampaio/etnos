(function() {
    'use strict';

    var DEBUG_MODE = true;

    // gulp-inject-debug-mode

    angular.module('EtnosApp')
        .constant('EtenosAppDebug', DEBUG_MODE)
        .config(EtnosApp);

    function EtnosApp($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/home/search');

        $stateProvider
            .state('home', {
                url: '/home',
                abstract: true,
                templateUrl: 'home/home.html',
                controller: 'HomeController',
                controllerAs: 'homeCtrl',
            })
            .state('home.search', {
                url: '/search',
                views: {
                    homeContent: {
                        templateUrl: 'search/search.html',
                        controller: 'SearchController',
                        controllerAs: 'searchCtrl',
                    },
                },
            })
            .state('home.info', {
                url: '/info',
                views: {
                    homeContent: {
                        templateUrl: 'infos/infos.html',
                    },
                },
            })
            .state('home.info.apresentacao', {
                url: '/apresentacao',
                views: {
                    infoContent: {
                        templateUrl: 'infos/content/apresentacao.html',
                    },
                },
            }).state('home.info.catalogo', {
                url: '/catalogo',
                views: {
                    infoContent: {
                        templateUrl: 'infos/content/catalogo.html',
                    },
                },
            }).state('home.info.fichatecnica', {
                url: '/fichatecnica',
                views: {
                    infoContent: {
                        templateUrl: 'infos/content/fichatecnica.html',
                    },
                },
            }).state('home.info.help', {
                url: '/help',
                views: {
                    infoContent: {
                        templateUrl: 'infos/content/help.html',
                    },
                },
            })
            .state('verbete', {
                url: '/verbete/:verbeteId',
                templateUrl: 'verbete-detail/verbete-detail.html',
                controller: 'VerbeteDetailController',
                controllerAs: 'vdCtrl',
            });

    }

})();
