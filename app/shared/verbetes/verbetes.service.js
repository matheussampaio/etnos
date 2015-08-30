(function() {
    'use strict';

    angular
        .module('EtnosApp')
        .service('Verbetes', Verbetes);

    function Verbetes() {
        var service = {
            data: {
                '00001': {
                    id: '00001',
                    images: [
                        '00001',
                        '00002',
                        '00003',
                        '00004',
                        '00005',
                        '00006',
                        '00007',
                    ],
                    path: 'alagoas/00001',
                    converted: [],
                },
            },
        };

        return service;
    }

})();
