(function() {
    'use strict';

    const path = require('path');
    const fs = require('fs');

    angular
        .module('EtnosApp')
        .service('VerbetesData', VerbetesData);

    function VerbetesData(nwUtilConstants) {
        const service = {
            data: {},
        };

        loadVerbete();

        return service;

        function loadVerbete() {
            const verbeteJsonPath = path.join(nwUtilConstants.VERBETES_PATH, 'verbetes.json');
            const verbetesJsonFile = fs.readFileSync(verbeteJsonPath, 'utf8');

            service.data = JSON.parse(verbetesJsonFile);
        }
    }

})();
