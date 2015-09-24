(function() {
    'use strict';

    angular.module('EtnosApp')
        .controller('InfosController', InfosController);

    function InfosController(Menu) {
        var vm = this;

        //Menu.resetAnimation();

        vm.Menu = Menu;
    }

})();
