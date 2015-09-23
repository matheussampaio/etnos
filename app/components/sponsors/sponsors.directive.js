(function() {
    'use strict';

    angular
        .module('EtnosApp')
        .directive('sponsors', sponsors);

    function sponsors() {
        return {
            restrict: 'E',
            templateUrl: 'sponsors/sponsors.html',
        };
    }

})();
