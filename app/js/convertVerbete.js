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
        fulfill(result);
    } else {

        var filepath = path.join(verbetePath, verbeteImages[0] + '.tif');
        var destpath = path.join(foldername, verbeteImages[0] + '.png');

        result.push(destpath);

        logger.info('converting ' + verbeteImages[0]);

        convertImage(filepath, destpath).then( function () {
            convertImages(fulfill, reject, verbetePath, verbeteImages.slice(1), foldername, result);
        }, function (error) {
            reject(error);
        });
    }
}


exports.convertVerbete = function (verbete) {
    var foldername = path.join(config.TEMP_FOLDER, verbete.path.slice(3));

    return new Promise(function (fulfill, reject) {
        createFolder(foldername).then(
            convertImages(fulfill, reject, verbete.path, verbete.images, foldername, [])
        );
    });
}