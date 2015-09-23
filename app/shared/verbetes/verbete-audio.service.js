(function() {
    'use strict';

    var path = require('path');

    angular.module('EtnosApp')
        .service('VerbeteAudio', VerbeteAudio);

    function VerbeteAudio($log, nwUtilConstants) {

        var service = {
            loadAudio: loadAudio,
        };

        return service;

        function loadAudio({verbete}) {
            $log.info('loading audio...');

            return Promise.resolve(path.join(nwUtilConstants.VERBETES_PATH, verbete.path, 'audio.ogg'));
        }
    }

})();
