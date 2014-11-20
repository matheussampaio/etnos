// path Object
var path = require('path');

// Promise Object
var Promise = require('promise');

var config = require('./config');

exports.load = function(verbete) {

  // var folderpath = path.resolve(__dirname, verbete.path) + '/';

  if (config.DEBUG) {
    var folderpath = path.resolve(__dirname, verbete.path) + '/';
  } else {
    var folderpath = path.join(path.dirname(process.execPath), verbete.path);
  }
  // var distpath = path.join(tmpFolder, verbete.path.slice(6));
  var filename = 'audio.ogg';

  return new Promise(function (fulfill, reject) {
    //zip a folder

    // var zip = new EasyZip();

    // zip.zipFolder(folderpath, function (err) {
    //   if (err)
    //     reject(err);
    //   else {
    //     zip.writeToFile(path.join(distpath, filename));
    //     verbete.zip = path.join(distpath, filename);
    //     verbete.zipname = filename;

    //     fulfill(verbete);
    //   }
    // });

    fulfill(path.join(folderpath, filename));
  });
}