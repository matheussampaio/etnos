'use strict';

var path = require('path');
var fs = require('fs');
var _ = require('lodash');
var utils = require('./utils');

/*
 * Renomeia todas as pastas e arquivos, removendo espacos, letras maiusculas e acentos.
 *
 * @param {string} parentFolder - Filename parent folder path.
 * @param {string} filename - Filename.
 */
function formatNames({parentFolder, filename}) {
    var newFilename = formatString(filename);

    var oldFullPath = path.join(parentFolder, filename);
    var newFullPath = path.join(parentFolder, newFilename);

    // Renomeia o arquivo.
    fs.renameSync(oldFullPath, newFullPath);

    // Se for diretorio, ler os arquivos filhos e chama recursivamente o formatNames para cada arquivo filho.
    if (fs.lstatSync(newFullPath).isDirectory()) {
        var files = utils.readdirSync(newFullPath);

        for (var i = 0; i < files.length; i++) {
            formatNames({
                parentFolder: newFullPath,
                filename: files[i],
            });
        }
    }
}

/*
 * Substitui letras maiusculas por minusculas, espacos por underlines e letras acentuadas por letras sem acentos.
 *
 * @param {string} text - String a ser formatado.
 * @returns {string} - String com letras minusculas e underlines.
 */
function formatString(text) {
    text = text.toLowerCase().trim().replace(/\s+/g, '_');

    var letters = 'abcdefghikjlmnopqrstuyvwxz1234567890_.'.split('');

    var r = '';

    for (var e of text) {
        if (_.contains(letters, e)) {
            r += e;
        }
    }

    return r;
}

export default formatNames;
