(function() {
    'use strict';

    angular
        .module('EtnosApp')
        .directive('navbar', navbar);

    function navbar() {
        return {
            restrict: 'E',
            templateUrl: 'navbar/navbar.html',
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
