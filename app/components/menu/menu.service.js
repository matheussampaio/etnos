(function() {
    'use strict';

    angular
        .module('EtnosApp')
        .service('Menu', Menu);

    function Menu($log) {
        var service = {
            showMenu: false,
            setShowMenu: setShowMenu,
            toggleMenu: toggleMenu,
        };

        return service;

        function toggleMenu() {
            service.showMenu = !service.showMenu;

            $log.info(`Menu toggled: ${service.showMenu}`);
        }

        function setShowMenu(show) {
            service.showMenu = show;
        }
    }

})();
