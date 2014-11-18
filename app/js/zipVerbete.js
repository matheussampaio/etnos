// Logger
var logger = require('./log');

// path Object
var path = require('path');

var config = require('./config');

var EasyZip = require('easy-zip').EasyZip;

// os Object
var os = require('os');

// Promise Object
var Promise = require('promise');

exports.zipVerbete = function(verbete) {

  if (config.DEBUG) {
    var folderpath = path.resolve(__dirname, verbete.path) + '/';
  } else {
    var folderpath = path.join(path.dirname(process.execPath), verbete.path);
  }

  logger.info('Ziping folder to ' + folderpath);

  var distpath = path.join(config.TEMP_FOLDER, verbete.path.slice(3));
  logger.log(distpath);
  var filename = 'verbete-' + verbete.id + '.zip';

  return new Promise(function (fulfill, reject) {
    //zip a folder
    var zip = new EasyZip();
    zip.zipFolder(folderpath, function (err) {
      if (err) {
        logger.error(err);
        logger.error(folderpath);
        reject(err);
      } else {
        zip.writeToFile(path.join(distpath, filename));
        verbete.zip = path.join(distpath, filename);
        verbete.zipname = filename;
        fulfill(verbete);
      }
    });
  });
}