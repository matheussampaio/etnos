(function() {
    'use strict';

    angular
        .module('EtnosApp')
        .service('ProgressBar', ProgressBar);

    function ProgressBar($log, ngProgressFactory) {
        var service = {
            bar: ngProgressFactory.createInstance(),
            start: start,
            stop: stop,
            complete: complete,
            increment: increment,
            setStep: setStep,
            step: 1,
            progress: 1,
        };

        return service;

        function start({progress = 1, color = 'green', height = '6px'} = {}) {
            $log.info('Starting progress bar...');

            service.progress = progress;

            service.bar.set(progress);
            service.bar.setColor(color);
            service.bar.setHeight(height);
        }

        function stop() {
            $log.info('Stoping progress bar...');

            service.bar.reset();
        }

        function complete() {
            $log.info('Completing progress bar...');

            service.bar.complete();
        }

        function setProgress(progress) {
            $log.debug(`Updating progress bar: ${progress}`);

            service.bar.set(progress);
        }

        function setStep(step) {
            service.step = step;
        }

        function increment() {
            service.progress += service.step;

            setProgress(service.progress);
        }
    }

})();
