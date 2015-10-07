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

    function MenuController($log, $location, $state, Menu) {
        const vm = this;

        vm.Menu = Menu;
        vm.isActive = isActive;
        vm.changeLocation = changeLocation;
        vm.menuOptions = getMenuOptions();

        ////////////////////

        function isActive(page) {
            return page === $state.current.name ? 'active' : '';
        }

        function changeLocation(state) {
            $log.info(`changing state: ${state}`);

            Menu.resetAnimation();

            $state.go(state);
        }

        function getMenuOptions() {
            return [
                {
                    state: 'home.search',
                    icon: 'fa-search',
                    name: 'Pesquisa',
                },
                {
                    state: 'home.info.apresentacao',
                    icon: 'fa-lightbulb-o',
                    name: 'Apresentação',
                },
                {
                    state: 'home.info.fichatecnica',
                    icon: 'fa-file-text-o',
                    name: 'Ficha Técnica',
                },
                {
                    state: 'home.info.catalogo',
                    icon: 'fa-folder-o',
                    name: 'Catálogo',
                },
                {
                    state: 'home.info.help',
                    icon: 'fa-question',
                    name: 'Ajuda',
                },
            ];
        }

    }

})();
