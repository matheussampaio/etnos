(function() {
    'use strict';

    angular
        .module('EtnosApp')
        .directive('searchBar', searchBar);

    function searchBar() {
        return {
            restrict: 'E',
            templateUrl: 'search-bar/search-bar.html',
        };
    }

})();
