(function() {
    'use strict';

    angular.module('EtnosApp')
        .controller('VerbeteListController', VerbeteListController);

    function VerbeteListController($log, $http, $location, toaster, Menu, Verbetes) {
        var vm = this;

        vm.search = search;
        vm.pop = pop;
        vm.closeAlert = closeAlert;
        vm.alert = {};
        vm.data = Menu.data;
        vm.data.search = '';

        /////////////////////////////

        function search(verbete) {
            verbete = _zeroPad(verbete, 5);

            if (Verbetes.data[verbete] === undefined) {
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

        function pop(err) {
            if (err) {
                toaster.pop(
                    'error',
                    'Erro na instalação',
                    'Não será possível visualizar as imagens.',
                    5000,
                    'trustedHtml'
                );

            } else {
                toaster.pop(
                    'success',
                    'Dependências instaladas.',
                    'Todas as dependências foram instaladas com sucesso.',
                    5000,
                    'trustedHtml'
                );

            }
        }

        function _zeroPad(num, places) {
            var zero = places - num.toString().length + 1;
            return Array(+(zero > 0 && zero)).join('0') + num;
        }

    }

})();
