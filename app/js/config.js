// os Object
var os = require('os');

// path Object
var path = require('path');

var fs = require('fs');
//create tmpfolder if not exits
if (!fs.existsSync(os.tmpDir())) {
  fs.mkdir(os.tmpDir());
}

exports.config = {
  'DEBUG': process.env.DEBUG || true,
  'TEMP_FOLDER': path.join(os.tmpDir(), 'etnos')
};