(function() {
    'use strict';

    var path = require('path');
    var mkdirp = require('mkdirp');
    var exec = require('child_process').exec;
    var jadepdf = require('jade-pdf-redline');
    var fs = require('fs');

    angular.module('EtnosApp')
        .service('VerbeteUtils', VerbeteUtils);

    function VerbeteUtils($log, EtenosAppDebug, nwUtilConstants, ProgressBar) {

        $log.warn(`process.execPath: ${process.execPath}`);
        $log.warn(`nwUtilConstants.DIRNAME: ${nwUtilConstants.DIRNAME}`);

        var service = {
            loadImages: loadImages,
            loadAudio: loadAudio,
            loadPDF: loadPDF,
        };

        return service;

        function loadPDF({verbete}) {

            var templateIMG = 'doctype html\nhtml(lang="en")\n  head\n    title= "pdf"\n  body\n';
            var distpath = path.join(nwUtilConstants.TEMP_FOLDER, verbete.path);
            var filename = `verbete-${verbete.id}.pdf`;
            var filenamejade = `verbete-${verbete.id}.jade`;

            $log.debug(`PDF distpath ${distpath}`);

            var pdf = {
                filename: filename,
                filepath: path.join(distpath, filename),
            };

            if (verbete.converted.length === verbete.images.length) {
                $log.info('Verbetes already converted...');
                return Promise.resolve(pdf);
            }

            return new Promise(resolve => {
                var stream = fs.createWriteStream(path.join(distpath, filenamejade));

                stream.once('open', function() {
                    stream.write(templateIMG);

                    for (var i in verbete.images) {
                        stream.write(_createImgTag(path.join(distpath, verbete.images[i])));
                    }

                    stream.end();

                    stream.on('close', function() {
                        $log.info('creating pdf...');

                        var streamPDF = fs.createReadStream(path.join(distpath, filenamejade))
                            .pipe(jadepdf())
                            .pipe(fs.createWriteStream(path.join(distpath, filename)));

                        streamPDF.on('close', function() {
                            $log.info('pdf created.');
                            resolve(pdf);
                        });
                    });
                });
            });
        }

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
                    $log.info(`convert finished: ${destpaths}`);

                    ProgressBar.complete();

                    return destpaths;
                });
        }

        function loadAudio({verbete}) {
            $log.info('loading audio...');

            return Promise.resolve(path.join(nwUtilConstants.VERBETES_PATH, verbete.path, 'audio.ogg'));
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
            $log.debug(`verbetePath: ${verbetePath}`);
            $log.debug(`verbeteImages: ${verbeteImages}`);
            $log.debug(`distFolderName: ${distFolderName}`);

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

                $log.debug(`COMMAND: ${command}`);

                exec(command, (error) => {
                    if (error) {
                        $log.error(`error converting ${distPath}: ${error.stack}`);
                        reject(error);
                    } else {
                        distPath = distPath.replace(/\\/g, `\\\\`);
                        $log.info(`image converted: ${distPath}`);
                        resolve(distPath);
                    }
                });

            });
        }

        function _createImgTag(pathname) {
            var normalizedPath = _normalizePath(pathname);

            return `    img(src='${normalizedPath}.png' width='1000' height='1400')\n`;
        }

        function _normalizePath(pathname) {
            var temp = pathname.split(path.sep);
            var returned = '';

            for (var i = 0; i < temp.length; i++) {
                returned += temp[i];

                if (i !== temp.length - 1) {
                    returned += '/';
                }

            }

            return returned;
        }

    }

})();
