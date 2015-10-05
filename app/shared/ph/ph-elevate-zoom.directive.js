(function() {
    'use strict';

    angular
        .module('EtnosApp')
        .directive('phElevateZoom', phElevateZoom);

    function phElevateZoom() {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                element.attr('data-zoom-image', attrs.zoomImage);

                $(element).elevateZoom({
                    scrollZoom: true,

                    //zoomType  : "inner",
                    zoomType: 'lens',
                    lensShape: 'round',
                    lensSize: 200,
                    zoomWindowFadeIn: 500,
                    lensFadeIn: 500,
                });
            },
        };
    }

})();
