(function() {
    'use strict';

    angular
        .module('EtnosApp')
        .directive('home', home);

    function home() {
        return {
            restrict: 'E',
            templateUrl: 'home/home.template.html',
            transclude: true,
        };
    }

})();
