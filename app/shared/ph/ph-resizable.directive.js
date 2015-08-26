(function() {
    'use strict';

    angular
        .module('EtnosApp')
        .directive('phResizable', phResizable);

    function phResizable($window) {
        return function($scope) {
            $scope.initializeWindowSize = function() {
                $scope.windowHeight = $window.innerHeight;
                $scope.windowWidth = $window.innerWidth;
            };

            $scope.initializeWindowSize();

            return angular.element($window).bind('resize', function() {
                $scope.initializeWindowSize();
                $scope.$apply();
            });
        };
    }

})();
