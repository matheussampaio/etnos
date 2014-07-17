// ImageMagick Object
var im = require('imagemagick');

// os Object
var os = require('os');

// path Object
var path = require('path');

// fs Object
var fs = require('fs');

// Promise Object
var Promise = require('promise');

var mkdirp = require('mkdirp');

// TMP Folder
var tmpFolder = path.join(os.tmpDir(), 'historia');


//create tmpfolder if not exits
if (!fs.existsSync(os.tmpDir())) {
  fs.mkdir(os.tmpDir());
}

if (!fs.existsSync(tmpFolder)) {
  fs.mkdir(tmpFolder);
}


function convertImage (filepath, destpath) {
  return new Promise(function (fulfill, reject) {
    im.convert(['-verbose', filepath, destpath], function (err) {
      if (err) reject(err);
      else fulfill(destpath);
    });
  });
}


function createFolder (foldername) {
  return new Promise(function (fulfill, reject) {
     mkdirp(foldername, function (err) {
      if (err) reject(err);
      else fulfill();
    });
  });
}


function convertImages (verbetePath, verbeteImages, foldername) {
  return Promise.all(verbeteImages.map(function (img) {
    return convertImage(path.join(verbetePath, img + '.TIF'), path.join(foldername, img + '.png'));
  }));
}

exports.convertVerbete = function (verbete) {
  var foldername = path.join(tmpFolder, verbete.path.slice(6));

  return new Promise(function (fulfill, reject) {
    createFolder(foldername).then(
      convertImages(verbete.path, verbete.images, foldername).then(fulfill, reject)
    );
  });
}

exports.wipeTmpFolder = function() {
  if (typeof tmpFolder != 'string') {
    return;
  }

  fs.readdir(tmpFolder, function(err, files){
    for (var i in files) {
      fs.unlink(path.join(tmpFolder, files[i]));
    }
  });
}
