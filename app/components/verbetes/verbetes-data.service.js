(function() {
    'use strict';

    var path = require('path');
    var fs = require('fs');

    angular
        .module('EtnosApp')
        .service('VerbetesData', VerbetesData);

    function VerbetesData(nwUtilConstants) {
        var service = {
            data: {},
        };

        loadVerbete();

        return service;

        function loadVerbete() {
            var verbeteJsonPath = path.join(nwUtilConstants.VERBETES_PATH, 'verbetes.json');
            var verbetesJsonFile = fs.readFileSync(verbeteJsonPath, 'utf8');

            service.data = JSON.parse(verbetesJsonFile);
        }
    }

})();
