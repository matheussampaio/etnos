(function() {
    'use strict';

    angular.module('EtnosApp')
        .controller('VerbeteDetailController', VerbeteDetailController);

    function VerbeteDetailController($log, $scope, $routeParams, $location, hotkeys, Menu, ngProgressFactory, Verbetes) {
        var vm = this;

        vm.backToHome = backToHome;
        vm.toggleZoom = toggleZoom;
        vm.printPDF = printPDF;
        vm.verbeteDetail = Verbetes.data[$routeParams.verbeteId];
        vm.zoomActive = false;
        vm.data = {};
        vm.complete = false;

        activate();

        /////////////////////////

        function activate() {
            Menu.data.showMenu = false;
            vm.progressbar = ngProgressFactory.createInstance();

            vm.progressbar.set(1);
            vm.progressbar.setColor('blue');
            vm.progressbar.setHeight('6px');


            // convert.convertVerbete(Verbetes.data[$routeParams.verbeteId], vm).done(function(results) {
            //     vm.verbeteDetail.converted = results;
            //     Verbetes.data[$routeParams.verbeteId].converted = results;
            //     ngProgress.complete();
            //     vm.$apply();
            //
            //     pdf.create(Verbetes.data[$routeParams.verbeteId]).done(function(pdffile) {
            //         vm.data.pdfpath = pdffile.filepath;
            //         vm.data.pdfname = pdffile.filename;
            //         vm.complete = true;
            //         vm.$apply();
            //
            //     }, function(err) {
            //         $log.error(err.stack);
            //     });
            //
            // }, function(err) {
            //     $log.error(err.stack);
            // }, function(progress) {
            //     var value = progress.length * 100 / Verbetes.data[$routeParams.verbeteId].images.length;
            //     ngProgress.set(value);
            //     vm.verbeteDetail.converted = progress;
            //     vm.$apply();
            // });
            //
            // loadAudio.load(Verbetes.data[$routeParams.verbeteId]).done(function(audio) {
            //     $log.info(audio);
            //     vm.data.audio = audio;
            //     vm.$apply();
            // }, function(err) {
            //     $log.error(err.stack);
            // });

            hotkeys.bindTo($scope)
                .add({
                    combo: 'esc',
                    description: 'Move to index',
                    callback: function() {
                        $log.info('Esc pressed, moving to index');
                        vm.removeZoomContainer();
                        $location.path('/');
                        vm.progressbar.reset();
                    },
                })
                .add({
                    combo: 'l',
                    description: 'Toggle Zoom',
                    callback: function() {
                        $log.info('Z pressed, togglin zoom');
                        vm.toggleZoom();
                    },
                })
                .add({
                    combo: 'ctrl+p',
                    description: 'Print',
                    callback: function() {
                        $log.info('CTRL + P, Printing...');
                        vm.printPDF();
                    },
                })
                .add({
                    combo: '?',
                    description: 'Help',
                    callback: function() {
                        $log.info('? pressed, showing help');
                    },
                });
        }

        function removeZoomContainer() {
            $('.zoomContainer').remove();
        }

        function toggleZoom() {
            vm.zoomActive = !vm.zoomActive;
        }

        function printPDF() {
        }

        function backToHome() {
            $log.info('back to home');

            $location.path('/home');

            removeZoomContainer();
            vm.progressbar.reset();
        }
    }

})();
