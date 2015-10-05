(function() {
    'use strict';

    angular.module('EtnosApp')
        .controller('SearchController', SearchController);

    function SearchController($log, $http, $location, VerbetesData, Menu) {
        var vm = this;

        vm.search = search;
        vm.closeAlert = closeAlert;
        vm.alert = {};
        vm.Menu = Menu;
        vm.data = {
            search: '',
        };

        /////////////////////////////

        function search(verbete) {
            $log.debug(`search term: ${verbete}`);

            verbete = verbete;

            if (VerbetesData.data[verbete] === undefined) {
                $log.error('Verbete não existe.' + verbete);

                vm.alert.msg = 'Verbete ' + verbete + ' não encontrado.';
                vm.alert.show = true;
            } else {
                $location.path('/verbete/' + verbete);
            }
        }

        function closeAlert() {
            vm.alert.show = false;
        }

    }

})();
