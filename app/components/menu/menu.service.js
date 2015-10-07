(function() {
    'use strict';

    angular
        .module('EtnosApp')
        .service('Menu', Menu);

    function Menu($log) {
        const service = {
            animationOut: false,
            animationIn: false,
            showMenu: false,
            setShowMenu: setShowMenu,
            toggleMenu: toggleMenu,
            resetAnimation: resetAnimation,
        };

        return service;

        function toggleMenu() {
            service.showMenu = !service.showMenu;

            service.animationIn = service.showMenu;
            service.animationOut = !service.showMenu;

            $log.info(`Menu toggled: ${service.showMenu}`);
        }

        function setShowMenu(show) {
            service.showMenu = show;
        }

        function resetAnimation() {
            service.animationIn = false;
            service.animationOut = false;
        }
    }

})();
