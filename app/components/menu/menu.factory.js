(function() {
    'use strict';

    angular
        .module('EtnosApp')
        .factory('Menu', Menu);

    function Menu() {
        return {
            data: {
                showMenu: false,
                toggleMenu: function() {
                    this.showMenu = !this.showMenu;
                },
            },

            // Other methods or objects can go here
        };
    }

})();
