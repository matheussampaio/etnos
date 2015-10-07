(function() {
    'use strict';

    var path = require('path');
    var mkdirp = require('mkdirp');
    var exec = require('child_process').exec;
    var StopWatch = require('moorea-stopwatch');

    angular.module('EtnosApp')
        .service('VerbeteImages', VerbeteImages);

    function VerbeteImages($log, _, nwUtilConstants) {

        var service = {
            loadImages: loadImages,
            notify: null,
            verbete: null,
        };

        return service;

        function loadImages({verbete, notify}) {
            $log.info('Converting verbetes...');

            // Save notify function for return results
            service.notify = notify;
            service.verbete = verbete;

            var distFolderName = path.join(nwUtilConstants.TEMP_FOLDER, verbete.path);
            var stopWatch = new StopWatch();

            return _createFolder(distFolderName)
                .then(distFolderName => {
                    $log.info(`verbetePath: ${verbete.path}`);
                    $log.info(`verbeteImages: ${verbete.images}`);
                    $log.info(`distFolderName: ${distFolderName}`);

                    return _convertImages({
                        verbeteId: verbete.id,
                        verbetePath: verbete.path,
                        verbeteImages: verbete.images,
                        distFolderName: distFolderName,
                    }).then(() => {
                        // return service.verbete.;
                    });
                })
                .then(destpaths => {

                    var elapsed = stopWatch.elapsed() / 1000;
                    console.log(`Image conversion time: ${elapsed.toFixed(2)}s. Avg: ${(elapsed / verbete.images.length).toFixed(2)}s per image.`);

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

        function _convertImages({verbeteId, verbetePath, verbeteImages, distFolderName} = {}) {
            return new Promise((resolve, reject) => {
                _convertImagesRecursive({
                    verbeteId,
                    verbetePath,
                    verbeteImages,
                    distFolderName,
                    resolve,
                    reject,
                });
            });
        }

        function _convertImagesRecursive({verbeteId, verbetePath, verbeteImages, distFolderName, resolve, reject} = {}) {
            if (verbeteImages.length === 0) {
                resolve();
            } else if (service.verbete.id !== verbeteId) {
                console.info(`Stop converting, different verbetes. Current: ${service.verbete.id}. Old: ${verbeteId}.`);
                reject();
            } else {

                var maxElements = _.random(2, 4); // max elements in each group

                _convertGroup({
                        verbetePath,
                        distFolderName,

                        verbeteImages: verbeteImages.slice(0, maxElements),
                    })
                    .then(imagePath => {

                        if (service.verbete.id === verbeteId) {
                            service.verbete.converted = service.verbete.converted.concat(imagePath);

                            if (service.notify) {
                                service.notify(imagePath);
                            }
                        } else {
                            console.info(`Skiping notify, different verbets. Current: ${service.verbete.id}. Old: ${verbeteId}.`);
                        }

                        _convertImagesRecursive({
                            verbeteId,
                            verbetePath,
                            distFolderName,
                            resolve,
                            reject,

                            verbeteImages: verbeteImages.slice(maxElements),
                        });
                    })
                    .catch(error => {
                        reject(error);
                    });
            }
        }

        function _convertGroup({verbetePath, verbeteImages, distFolderName} = {}) {
            var convertImagesPromises = verbeteImages.map((img) => {
                var filePath = path.join(verbetePath, img + '.tif');
                var distPath = path.join(distFolderName, img + '.png');

                return _convertImage({
                    filePath,
                    distPath,
                });
            });

            return Promise.all(convertImagesPromises);
        }

        function _convertImage({filePath, distPath}) {
            filePath = path.resolve(nwUtilConstants.VERBETES_PATH, filePath);

            // If image is already converted, skip
            if (_.includes(service.verbete.converted, distPath)) {
                $log.debug(`already converted: ${distPath}`);

                // FIXME: For some reason, if I serve the paths to fast, the carousel will bug.
                //        So I add 1000ms.
                return new Promise(resolve => {
                    setTimeout(() => {
                        resolve(distPath);
                    }, 1000);
                });
            }

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
