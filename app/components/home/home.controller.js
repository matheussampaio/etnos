(function() {
    'use strict';

    angular.module('EtnosApp')
        .controller('HomeController', HomeController);

    function HomeController($log, Menu) {
        this.Menu = Menu;

        /////////////////////////////

    }

})();
