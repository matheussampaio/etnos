(function() {
    'use strict';

    angular.module('EtnosApp')
        .controller('VerbeteDetailController', VerbeteDetailController);

    function VerbeteDetailController($log, $scope, $routeParams, $location, hotkeys,
        Menu, ngProgressFactory, Verbetes, VerbeteUtils, ProgressBar) {

        var vm = this;

        vm.currentVerbeteId = $routeParams.verbeteId;

        vm.backToHome = backToHome;
        vm.toggleZoom = toggleZoom;
        vm.printPDF = printPDF;
        vm.verbeteDetail = Verbetes.data[vm.currentVerbeteId];
        vm.zoomActive = false;
        vm.data = {};
        vm.complete = false;

        activate();

        /////////////////////////

        function activate() {
            bindKeys();

            _startLoadAudio();
            _loadImages()
                .then(_loadPDF());

            Menu.data.showMenu = false;
        }

        function _loadImages() {
            return VerbeteUtils.loadImages({
                    verbete: vm.verbeteDetail,
                })
                .then(results => {
                    vm.verbeteDetail.converted = results;

                    // Verbetes.data[vm.currentVerbeteId].converted = results;

                    $scope.$apply();

                    return;
                });
        }

        function _loadPDF() {
            return VerbeteUtils.loadPDF({
                    verbete: vm.verbeteDetail,
                })
                .then(pdfFile => {
                    vm.data.pdfpath = pdfFile.filepath,
                    vm.data.pdfname = pdfFile.filename,
                    vm.complete = true;

                    $scope.$apply();
                })
                .catch(error => {
                    $log.error('error on loading pdf', error.stack);
                });
        }

        function _startLoadAudio() {
            return VerbeteUtils.loadAudio({
                    verbete: vm.verbeteDetail,
                })
                .then(audio => {
                    vm.data.audio = audio;
                    $scope.$apply();
                })
                .catch(error => {
                    $log.error(error.stack);
                });
        }

        function bindKeys() {
            hotkeys.bindTo($scope)
                .add({
                    combo: 'esc',
                    description: 'Move to index',
                    callback: function() {
                        $log.info('ESC pressed.');
                        backToHome();
                    },
                })
                .add({
                    combo: 'l',
                    description: 'Toggle Zoom',
                    callback: () => {
                        $log.info('L pressed');
                        toggleZoom();
                    },
                })
                .add({
                    combo: 'ctrl+p',
                    description: 'Print',
                    callback: () => {
                        $log.info('Ctrl+P pressed.');
                        printPDF();
                    },
                })
                .add({
                    combo: '?',
                    description: 'Help',
                    callback: () => {
                        $log.info('? pressed.');
                        toggleHelp();
                    },
                });
        }

        function removeZoomContainer() {
            $('.zoomContainer').remove();
        }

        function toggleZoom() {
            $log.info('toggling zoom...');

            vm.zoomActive = !vm.zoomActive;
        }

        function printPDF() {
            $log.info('printing PDF...');
        }

        function toggleHelp() {
            $log.info('toggling help...');
        }

        function backToHome() {
            $log.info('back to home');

            $location.path('/home');

            removeZoomContainer();
            ProgressBar.stop();
        }
    }

})();
