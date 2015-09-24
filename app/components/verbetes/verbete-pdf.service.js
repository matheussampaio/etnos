(function() {
    'use strict';

    var path = require('path');
    var jadepdf = require('jade-pdf-redline');
    var fs = require('fs');

    angular.module('EtnosApp')
        .service('VerbetePdf', VerbetePdf);

    function VerbetePdf($log, nwUtilConstants) {

        var service = {
            loadPDF: loadPDF,
        };

        return service;

        function loadPDF({verbete}) {
            $log.info('starting loadPDF');

            var templateIMG = 'doctype html\nhtml(lang="en")\n  head\n    title= "pdf"\n  body\n';
            var distpath = path.join(nwUtilConstants.TEMP_FOLDER, verbete.path);
            var filename = `verbete-${verbete.path.replace('/', '-')}.pdf`;
            var filenamejade = `verbete-${verbete.id}.jade`;

            $log.debug(`PDF distpath ${distpath}`);

            var pdf = {
                filename: filename,
                filepath: path.join(distpath, filename),
            };

            if (verbete.pdf !== undefined) {
                $log.info('PDF already generated...');
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
