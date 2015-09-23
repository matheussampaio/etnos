(function() {
    'use strict';

    angular
        .module('EtnosApp')
        .directive('infos', infos);

    function infos() {
        return {
            restrict: 'E',
            templateUrl: 'infos/infos.html',
            transclude: true,
        };
    }

})();
