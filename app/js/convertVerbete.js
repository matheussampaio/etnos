var config = require('./config.js').config;

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
var sys = require('sys')
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

//create tmpfolder if not exits
if (!fs.existsSync(os.tmpDir())) {
  fs.mkdir(os.tmpDir());
}

if (!fs.existsSync(tmpFolder)) {
  fs.mkdir(tmpFolder);
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
     if (err) reject(err);
     else fulfill(destpath);
   });

      // im.convert(['-verbose', path.join(__dirname, filepath), destpath], function (err) {
      //     if (err) reject(err);
      //     else fulfill(destpath);
      // });
});
}


function createFolder (foldername) {
  console.log('Creating folder', foldername);

  return new Promise(function (fulfill, reject) {
   mkdirp(foldername, function (err) {
    if (err) reject(err);
    else fulfill();
  });
 });
}


function convertImages (verbetePath, verbeteImages, foldername) {
  return new Promise.all(verbeteImages.map(function (img) {
    return convertImage(path.join(verbetePath, img + '.tif'), path.join(foldername, img + '.png'));
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
