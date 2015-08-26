(function() {
    'use strict';

    angular
        .module('EtnosApp')
        .directive('hyperlink', hyperlink);

    function hyperlink() {
        return {
            restrict: 'E',
            transclude: true,
            scope: { href:'@' },
            template: `<a ng-click='openURL(href)' ng-transclude></a>`,
            link: function(scope, element) {
                scope.openURL = function(href) {
                    gui.Shell.openExternal(href);
                };
            },
        };
    }

})();
