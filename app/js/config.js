// os Object
var os = require('os');

// path Object
var path = require('path');

var fs = require('fs');

var tmpFolder = path.join(os.tmpDir(), 'etnos');

//create tmpfolder if not exits
if (!fs.existsSync(os.tmpDir())) {
  fs.mkdir(os.tmpDir());
}

if (!fs.existsSync(tmpFolder)) {
  fs.mkdir(tmpFolder);
}

exports.config = {
  'DEBUG': process.env.DEBUG || true,
  'TEMP_FOLDER': tmpFolder
};