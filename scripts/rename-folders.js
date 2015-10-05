'use strict';

var path = require('path');
var fs = require('fs');
var utils = require('./utils');

function renameFolders({parentDir, numBegin, numEnd}) {
    var files = utils.readdirSync(parentDir);

    // Check if there is folders numbers match.
    var numberOfVerbetes = numEnd - numBegin + 1;
    if (files.length !== numberOfVerbetes) {
        console.error('\t\tFolders numbers don\'t match.');
        console.error(`\t\tIt's suposed to have ${numberOfVerbetes} files.`);
        console.error(`\t\tBut ${files.length} files are found. Difference of ${files.length - numberOfVerbetes} files.`);

        return false;
    }

    for (var i = 0; i < files.length; i++) {
        var newName = numBegin + i + '';

        rename(parentDir, files[i], newName);

        var verbeteFolder = path.join(parentDir, newName);

        var tifs = utils.readdirSync(verbeteFolder);

        for (var j = 0; j < tifs.length; j++) {
            rename(verbeteFolder, tifs[j], (j + 1) + '.tif');
        }
    }
}

function rename(parent, folder, newName) {
    var oldFolder = path.join(parent, folder);
    var newFolder = path.join(parent, newName);

    // Renomeia o arquivo.
    if (oldFolder !== newFolder) {
        fs.renameSync(oldFolder, newFolder);
    }
}

export default renameFolders;
