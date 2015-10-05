(function() {
    'use strict';

    angular.module('EtnosApp')
        .controller('HomeController', HomeController);

    function HomeController($log, Menu) {
        var vm = this;

        vm.Menu = Menu;

        /////////////////////////////

    }

})();
