(function() {
    'use strict';

    angular.module('EtnosApp')
        .controller('VerbeteDetailController', VerbeteDetailController);

    function VerbeteDetailController($log, $scope, $routeParams, $location, hotkeys,
        Menu, ngProgressFactory, VerbetesData, VerbeteImages, VerbeteAudio, VerbetePdf, ProgressBar) {

        var vm = this;

        vm.zoomActive = false;
        vm.verbeteReady = false;

        vm.currentVerbeteId = $routeParams.verbeteId;
        vm.verbeteDetail = VerbetesData.data[vm.currentVerbeteId];

        vm.backToHome = backToHome;
        vm.toggleZoom = toggleZoom;

        activate();

        /////////////////////////

        function activate() {
            console.log(vm.verbeteDetail);

            _loadImages()
                .then(() => {
                    _loadPDF();

                    // FIXME: Trick function. Wait 1 second to prevent showing the carousel while it still rendering.
                    setTimeout(function() {
                        vm.verbeteReady = true;

                        $scope.$apply();
                    }, 1000);
                });

            bindKeys();

            _startLoadAudio();

            Menu.setShowMenu(false);
        }

        function _loadImages() {
            return VerbeteImages.loadImages({
                    verbete: vm.verbeteDetail,

                })
                .then(verbetesConvertedPath => {
                    vm.verbeteDetail.converted = verbetesConvertedPath;

                    $scope.$apply();
                })
                .catch(error => {
                    $log.error('error on loading images', error.stack);
                });
        }

        function _loadPDF() {
            return VerbetePdf.loadPDF({
                    verbete: vm.verbeteDetail,
                })
                .then(pdfFile => {
                    vm.verbeteDetail.pdf = pdfFile;

                    $scope.$apply();
                })
                .catch(error => {
                    $log.error('error on loading pdf', error.stack);
                });
        }

        function _startLoadAudio() {
            return VerbeteAudio.loadAudio({
                    verbete: vm.verbeteDetail,
                })
                .then(audio => {
                    vm.verbeteDetail.audio = audio;

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
                    description: 'Move to home',
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
                });
        }

        function removeZoomContainer() {
            $('.zoomContainer').remove();
        }

        function toggleZoom() {
            $log.info('toggling zoom...');

            vm.zoomActive = !vm.zoomActive;
        }

        function backToHome() {
            $log.info('back to home');

            ProgressBar.stop();
            removeZoomContainer();

            $location.path('/home');
        }

    }

})();
