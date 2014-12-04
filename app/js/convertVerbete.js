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


function seq() {

}


function convertImages (fulfill, reject, verbetePath, verbeteImages, foldername, result) {
    if (verbeteImages.length == 0) {
        logger.warn('convert finished : ' + result.length);
        fulfill(result);
    } else {

        var min = 5;
        var max = 10;

        var max_length = Math.floor(Math.random() * (max - min + 1)) + min;

        var max_index = verbeteImages.length > max_length ? max_length : verbeteImages.length;
        logger.info('converting group : ' + verbeteImages.slice(0, max_index));

        var groupPromise = new Promise.all(verbeteImages.slice(0, max_index).map(function (img) {
            return convertImage(path.join(verbetePath, img + '.tif'), path.join(foldername, img + '.png'));
        })).then( function (value) {
            value.forEach(function (item) {
                result.push(item);
            });

            convertImages(fulfill, reject, verbetePath, verbeteImages.slice(max_index), foldername, result);
        }, function (error) {
            reject(error);
        });
    }
}


exports.convertVerbete = function (verbete, $scope) {
    var foldername = path.join(config.TEMP_FOLDER, verbete.path.slice(3));

    return new Promise(function (fulfill, reject) {
        createFolder(foldername).then(
            convertImages(fulfill, reject, verbete.path, verbete.images, foldername, [])
        );
    });
}