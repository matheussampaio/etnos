// Logger
var logger = require('./log');

var path = require('path');

var config = require("./config");

// os Object
var os = require('os');

// Promise Object
var Promise = require('promise');

// path Object
var path = require('path');

var jadepdf = require('jade-pdf-redline');
var fs = require('fs');

exports.create = function(verbete) {

    var templateIMG = 'doctype html\nhtml(lang="en")\n  head\n    title= "pdf"\n  body\n';
    var distpath = path.join(config.TEMP_FOLDER, verbete.path.slice(3));
    var filename = 'verbete-' + verbete.id + '.pdf';
    var filenamejade = 'verbete-' + verbete.id + '.jade';

    return new Promise(function (fulfill, reject) {
        var stream = fs.createWriteStream(path.join(distpath, filenamejade));
        
        stream.once('open', function(fd) {
            stream.write(templateIMG);
            
            for (i in verbete.images) {
                stream.write(createImgTag(path.join(distpath, verbete.images[i])));
            }
            
            stream.end();
            

            stream.on('close', function() {
                logger.info('creating pdf...');

                streamPDF = fs.createReadStream(path.join(distpath, filenamejade))
                    .pipe(jadepdf())
                    .pipe(fs.createWriteStream(path.join(distpath, filename)));


                var pdf = {
                    'filename' : filename,
                    'filepath' : path.join(distpath, filename)
                }

                streamPDF.on('close', function(){
                    logger.info('pdf created.');
                    fulfill(pdf)
                });
            });
        });
    });

}

function createImgTag(pathname){
    return '    img(src="' + normalizepath(pathname) + '.png" width = "1000" height= "1400")\n'.replace("\\", "//");
}

function normalizepath(pathname){
    var temp = pathname.split(path.sep);
    var returned = '';

    for (i = 0; i < temp.length; i++) {
        returned += temp[i];
        
        if (i != temp.length - 1) {
            returned += '/';
        }

    }
    return returned;
}
