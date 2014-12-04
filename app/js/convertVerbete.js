// Logger
var logger = require('./log');

var config = require('./config');

// os Object
var os = require('os');

// path Object
var path = require('path');

// fs Object
var fs = require('fs');

// Promise Object
var Promise = require('promise');

var Q = require('q');

var mkdirp = require('mkdirp');
var exec = require('child_process').exec;

var isWin = (process.platform === 'win32');
var isLinux = (process.platform === 'linux');
var isOSX = (process.platform === 'darwin');


if (config.DEBUG) {
    if (isWin)   { imageMagickPath = path.join(__dirname, '/imagemagick-win/convert'); }
    if (isLinux) { imageMagickPath = path.join(__dirname, '/imagemagick-linux/convert'); }
    if (isOSX)   { imageMagickPath = path.join(__dirname, '/imagemagick-macos/bin/convert'); }
} else {
    if (isWin)   { imageMagickPath = path.join(path.dirname(process.execPath), '/imagemagick-win/convert'); }
    if (isLinux) { imageMagickPath = path.join(path.dirname(process.execPath), '/imagemagick-linux/convert'); }
    if (isOSX)   { imageMagickPath = path.join(path.dirname(process.execPath),'/imagemagick-macos/bin/convert'); }
}



function convertImage (filepath, destpath) {
    if (config.DEBUG) {
        filepath = path.join(__dirname, filepath);
    } else {
        filepath = path.join(path.dirname( process.execPath ), filepath);
    }

    return new Promise(function (fulfill, reject) {

        var cmd = [imageMagickPath, '-verbose', filepath, destpath].join(' ');

        exec(cmd, function (err) {
            if (err) {
                logger.error('error converting ' + destpath, err.stack);
                reject(err);
            } else {
                logger.info('image converted: ' + destpath);
                fulfill(destpath);
            }
        });

    });
}


function createFolder (foldername) {
    logger.info('Creating folder', foldername);

    return new Promise(function (fulfill, reject) {
        mkdirp(foldername, function (err) {
            if (err) {
                logger.error('error creating folder ' + foldername, err.stack);
                reject(err);
            } else {
                logger.info('folder created: ' + foldername);
                fulfill(foldername);
            }
        });
    });
}


function convertImages (deferred, verbetePath, verbeteImages, foldername, result) {
    if (verbeteImages.length == 0) {
        logger.warn('convert finished : ' + result.length);
        deferred.resolve(result);
    } else {

        var min = 1;
        var max = 5;

        var max_length = Math.floor(Math.random() * (max - min + 1)) + min;

        var max_index = verbeteImages.length > max_length ? max_length : verbeteImages.length;
        logger.info('converting group : ' + verbeteImages.slice(0, max_index));

        var groupPromise = new Promise.all(verbeteImages.slice(0, max_index).map(function (img) {
            var filepath = path.join(verbetePath, img + '.tif');
            var destpath = path.join(foldername, img + '.png');

            return convertImage(filepath, destpath);
        })).then( function (value) {
            value.forEach(function (item) {
                result.push(item);
            });

            deferred.notify(result);

            convertImages(deferred, verbetePath, verbeteImages.slice(max_index), foldername, result);
        }, function (error) {
            deferred.reject(error);
        });
    }
}


exports.convertVerbete = function (verbete) {
    // use Q.defer() to create a deferred.
    var deferred = Q.defer();

    var foldername = path.join(config.TEMP_FOLDER, verbete.path.slice(3));

    createFolder(foldername).then(
        convertImages(deferred, verbete.path, verbete.images, foldername, [])
    );

    return deferred.promise;
}