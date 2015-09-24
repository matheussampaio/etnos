(function() {
    'use strict';

    angular
        .module('EtnosApp')
        .directive('menu', menu);

    function menu() {
        return {
            restrict: 'E',
            templateUrl: 'menu/menu.html',
            controller: MenuController,
            controllerAs: 'menuCtrl',
        };
    }

    function MenuController($log, $location, Menu) {
        var vm = this;

        vm.isActive = isActive;
        vm.changeLocation = changeLocation;

        vm.menuOptions = getMenuOptions();

        ////////////////////

        function isActive(page) {
            var current = $location.path().substring(1);
            return page === current ? 'active' : '';
        }

        function changeLocation(location) {
            $log.info(`change location: ${location}`);

            Menu.resetAnimation();

            $location.path(location);
        }

        function getMenuOptions() {
            return [
                {
                    link: 'home',
                    icon: 'fa-search',
                    name: 'Pesquisa',
                },
                {
                    link: 'infos/apresentacao',
                    icon: 'fa-lightbulb-o',
                    name: 'Apresentação',
                },
                {
                    link: 'infos/fichatecnica',
                    icon: 'fa-file-text-o',
                    name: 'Ficha Técnica',
                },
                {
                    link: 'infos/catalogo',
                    icon: 'fa-folder-o',
                    name: 'Catálogo',
                },
                {
                    link: 'infos/help',
                    icon: 'fa-question',
                    name: 'Ajuda',
                },
            ];
        }

    }

})();
