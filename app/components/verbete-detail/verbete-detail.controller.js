(function() {
    'use strict';

    angular.module('EtnosApp')
        .controller('VerbeteDetailController', VerbeteDetailController);

    function VerbeteDetailController($log, $scope, $stateParams, $state, hotkeys,
        Menu, ngProgressFactory, VerbetesData, VerbeteImages, VerbeteAudio, VerbetePdf, ProgressBar) {

        var vm = this;

        vm.zoomActive = false;
        vm.verbeteReady = false;

        vm.currentVerbeteId = $stateParams.verbeteId;
        vm.imagesPath = [];
        vm.verbeteDetail = VerbetesData.data[vm.currentVerbeteId];

        vm.backToHome = backToHome;
        vm.toggleZoom = toggleZoom;
        vm.showHelp = showHelp;

        activate();

        /////////////////////////

        function activate() {
            console.log(vm.verbeteDetail);

            _loadImages()
                .then(() => {
                    _loadPDF();
                });

            bindKeys();

            _startLoadAudio();

            Menu.setShowMenu(false);
        }

        function _loadImages() {
            return VerbeteImages.loadImages({
                    verbete: vm.verbeteDetail,
                    notify: (verbete) => {
                        console.log(`callback verbete: ${verbete}`);

                        vm.imagesPath = vm.imagesPath.concat(verbete);

                        // FIXME: Trick function. Wait 1 second to prevent showing the
                        //        carousel while it still rendering.
                        if (!vm.verbeteReady) {
                            setTimeout(function() {
                                vm.verbeteReady = true;

                                $scope.$apply();
                            }, 1000);
                        }
                    },
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
                    description: 'Voltar.',
                    callback: function() {
                        $log.info('ESC pressed.');
                        backToHome();
                    },
                })
                .add({
                    combo: 'z',
                    description: 'Ativar/Desativar Lupa.',
                    callback: () => {
                        $log.info('z pressed');
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

        function showHelp() {
            hotkeys.toggleCheatSheet();
        }

        function backToHome() {
            $log.info('back to home');

            ProgressBar.stop();
            removeZoomContainer();

            vm.imagesPath = [];
            vm.verbeteReady = false;

            $state.go('home.search');
        }

    }

})();
