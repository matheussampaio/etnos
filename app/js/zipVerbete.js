// path Object
var path = require('path');

var EasyZip = require('easy-zip').EasyZip;

// os Object
var os = require('os');

// TMP Folder
var tmpFolder = path.join(os.tmpDir(), 'historia');

// Promise Object
var Promise = require('promise');

// path Object
var path = require('path');


exports.zipVerbete = function(verbete) {

  var folderpath = path.resolve(__dirname, verbete.path) + '/';
  var distpath = path.join(tmpFolder, verbete.path.slice(6));
  var filename = 'verbete-' + verbete.id + '.zip';

  return new Promise(function (fulfill, reject) {
    //zip a folder
    var zip = new EasyZip();
    zip.zipFolder(folderpath, function (err) {
      if (err)
        reject(err);
      else {
        zip.writeToFile(path.join(distpath, filename));
        verbete.zip = path.join(distpath, filename);
        verbete.zipname = filename;

        fulfill(verbete);
      }
    });
  });
}