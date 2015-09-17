(function() {
    'use strict';

    angular.module('EtnosApp')
        .controller('InfosController', InfosController);

    function InfosController(Menu) {
        var vm = this;

        vm.Menu = Menu;
    }

})();
