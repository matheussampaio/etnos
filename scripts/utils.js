'use strict';

var fs = require('fs');
var path = require('path');
var _ = require('lodash');

function _filterOSFiles(file) {
    return file.toLowerCase() !== '.DS_Store'.toLowerCase();
}

function _strcmp(a, b) {
    return a > b ? 1 : a < b ? -1 : 0;
}

function _natcmp(a, b) {
    var x = [];
    var y = [];

    a.replace(/(\d+)|(\D+)/g, function($0, $1, $2) {
        x.push([$1 || 0, $2]);
    });

    b.replace(/(\d+)|(\D+)/g, function($0, $1, $2) {
        y.push([$1 || 0, $2]);
    });

    while (x.length && y.length) {
        var xx = x.shift();
        var yy = y.shift();
        var nn = (xx[0] - yy[0]) || _strcmp(xx[1], yy[1]);
        if (nn) return nn;
    }

    if (x.length) return -1;
    if (y.length) return +1;

    return 0;
}

var Utils = {
    readdirSync(filepath) {
        return fs.readdirSync(filepath)
            .filter(_filterOSFiles)
            .sort(_natcmp);
    },
};

export default Utils;
