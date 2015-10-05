var os = require('os');
var path = require('path');
var fs = require('fs');

var DEBUG_MODE = true;

var tmpFolder = path.join(os.tmpDir(), 'etnos');

var isWin = (process.platform === 'win32');
var isLinux = (process.platform === 'linux');
var isOSX = (process.platform === 'darwin');

var imageMagickPath = getImageMagickPath();
var verbeteFilesPath = getVerbetesFilesPath();

function getImageMagickPath() {
    if (DEBUG_MODE) {
        if (isWin) {
            return path.join(__dirname, '../imagemagick/win/convert');
        }

        if (isLinux) {
            return path.join(__dirname, '/imagemagick/linux/convert');
        }

        if (isOSX) {
            return 'convert';
        }
    } else {
        if (isWin) {
            return path.join(path.dirname(process.execPath), '/imagemagick-win/convert');
        }

        if (isLinux) {
            return path.join(path.dirname(process.execPath), '/imagemagick-linux/convert');
        }

        if (isOSX) {
            return 'convert';
        }
    }
}

function getVerbetesFilesPath() {
    var currentFolder = __dirname;
    var folderName = 'files';

    while (currentFolder !== '/') {
        var currentPath = path.join(currentFolder, folderName);

        if (fs.existsSync(currentPath)) {
            console.info('files EXISTS in ' + currentFolder);
            return currentPath;
        } else {
            console.info('files not exists in ' + currentFolder);
        }

        currentFolder = path.resolve(currentFolder, '..');
    }

    throw new Error('verbetes files not found');
}

const CONSTANTS = {
    TEMP_FOLDER: tmpFolder,
    DIRNAME: __dirname,
    IMAGE_MAGICK_PATH: imageMagickPath,
    VERBETES_PATH: verbeteFilesPath,
    EXEC_PATH: process.execPath,
};

console.info(`CONSTANTS: ${JSON.stringify(CONSTANTS)}`);

module.exports = CONSTANTS;
