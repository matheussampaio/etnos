(function() {
    'use strict';

    var path = require('path');
    var jadepdf = require('jade-pdf-redline');
    var fs = require('fs');
    var StopWatch = require('moorea-stopwatch');

    angular.module('EtnosApp')
        .service('VerbetePdf', VerbetePdf);

    function VerbetePdf($log, nwUtilConstants) {

        var service = {
            loadPDF: loadPDF,
        };

        return service;

        function loadPDF({verbete}) {
            if (verbete.pdf) {
                if (verbete.pdf.loading) {
                    $log.info('pdf already loading, waiting...');

                    return new Promise(resolve => {
                        var interval = setInterval(() => {

                            if (verbete.pdf.finished) {
                                resolve(verbete.pdf);
                                clearInterval(interval);
                            } else {
                                $log.info('pdf still loading, waiting...');
                            }

                        }, 5000);
                    });
                }

                if (verbete.pdf.finished) {
                    $log.info('pdf already created, skiping...');
                    return Promise.resolve(verbete.pdf);
                }
            }

            var templateIMG = 'doctype html\nhtml(lang="en")\n  head\n    title= "pdf"\n  body\n';
            var distpath = path.join(nwUtilConstants.TEMP_FOLDER, verbete.path);
            var filename = `verbete-${verbete.path.replace('/', '-')}.pdf`;
            var filenamejade = `verbete-${verbete.id}.jade`;

            verbete.pdf = {
                filename: filename,
                filepath: path.join(distpath, filename),
                loading: true,
                finished: false,
            };

            return new Promise(resolve => {

                var stream = fs.createWriteStream(path.join(distpath, filenamejade));

                var stopWatch = new StopWatch();

                stream.once('open', function() {
                    $log.info(`Creating PDF template for verbete ${verbete.id}...`);

                    stream.write(templateIMG);

                    for (var i in verbete.images) {
                        stream.write(_createImgTag(path.join(distpath, verbete.images[i])));
                    }

                    $log.info(`PDF template for verbete ${verbete.id} created.`);

                    stream.end();

                    stream.on('close', function() {
                        $log.info(`Saving PDF of verbete ${verbete.id}...`);

                        var streamPDF = fs.createReadStream(path.join(distpath, filenamejade))
                            .pipe(jadepdf())
                            .pipe(fs.createWriteStream(path.join(distpath, filename)));

                        streamPDF.on('close', function() {
                            $log.info(`Verbete ${verbete.id} PDF saved.`);

                            verbete.pdf.loading = false;
                            verbete.pdf.finished = true;

                            resolve(verbete.pdf);

                            var elapsed = stopWatch.elapsed() / 1000;
                            console.log(`PDF Creating time: ${elapsed.toFixed(2)}s. Avg: ${(elapsed / verbete.images.length).toFixed(2)}s per image.`);

                        });
                    });
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
