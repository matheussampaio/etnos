(function() {
    'use strict';

    angular
        .module('EtnosApp')
        .directive('menu', menu);

    function menu() {
        return {
            restrict: 'E',
            templateUrl: 'menu/menu.html',
            controller: NavbarController,
            controllerAs: 'navbarCtrl',
        };
    }

    function NavbarController($location) {
        var vm = this;

        vm.menuClass = menuClass;

        ////////////////////

        function menuClass(page) {
            var current = $location.path().substring(1);
            return page === current ? 'active' : '';
        }

    }

})();
