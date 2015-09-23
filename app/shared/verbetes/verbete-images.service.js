(function() {
    'use strict';

    var path = require('path');
    var mkdirp = require('mkdirp');
    var exec = require('child_process').exec;

    angular.module('EtnosApp')
        .service('VerbeteImages', VerbeteImages);

    function VerbeteImages($log, nwUtilConstants, ProgressBar) {

        var service = {
            loadImages: loadImages,
        };

        return service;

        function loadImages({verbete}) {
            $log.info('Converting verbetes...');

            if (verbete.converted.length === verbete.images.length) {
                $log.info('Verbetes already converted...');
                return Promise.resolve(verbete.converted);
            }

            ProgressBar.start();

            var distFolderName = path.join(nwUtilConstants.TEMP_FOLDER, verbete.path);

            return _createFolder(distFolderName)
                .then(distFolderName => {
                    return _convertImages({
                        verbetePath: verbete.path,
                        verbeteImages: verbete.images,
                        distFolderName: distFolderName,
                    });
                })
                .then(destpaths => {
                    $log.info(`convert finished, images converted: ${destpaths.length}`);

                    ProgressBar.complete();

                    return destpaths;
                });
        }

        function _createFolder(foldername) {
            return new Promise((resolve, reject) => {
                mkdirp(foldername, (error) => {
                    if (error) {
                        $log.error(`error creating folder ${foldername}: ${error.stack}`);
                        reject(error);

                    } else {
                        $log.info(`folder created: ${foldername}`);
                        resolve(foldername);

                    }
                });
            });
        }

        function _convertImages({verbetePath, verbeteImages, distFolderName} = {}) {
            $log.info(`verbetePath: ${verbetePath}`);
            $log.info(`verbeteImages: ${verbeteImages}`);
            $log.info(`distFolderName: ${distFolderName}`);

            var convertImagesPromises = verbeteImages.map((img) => {
                var filePath = path.join(verbetePath, img + '.tif');
                var distPath = path.join(distFolderName, img + '.png');

                return _convertImage({
                    filePath: filePath,
                    distPath: distPath,
                });
            });

            return Promise.all(convertImagesPromises);
        }

        function _convertImage({filePath, distPath}) {
            filePath = path.resolve(nwUtilConstants.VERBETES_PATH, filePath);

            return new Promise((resolve, reject) => {
                var command = `${nwUtilConstants.IMAGE_MAGICK_PATH} -verbose ${filePath} ${distPath}`;

                exec(command, (error) => {
                    if (error) {
                        $log.error(`error converting ${distPath}: ${error.stack}`);
                        reject(error);
                    } else {
                        distPath = distPath.replace(/\\/g, `\\\\`);
                        $log.debug(`image converted: ${distPath}`);
                        resolve(distPath);
                    }
                });

            });
        }

    }

})();
