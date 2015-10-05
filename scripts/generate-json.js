'use strict';

var path = require('path');
var fs = require('fs');
var _ = require('lodash');
var utils = require('./utils');

function generateJSON({rootPath = '', outputName = 'verbetes.json'}) {
    if (_.isEmpty(rootPath)) {
        console.error(`ERROR: rootPath is undefined.`);
        return false;
    }

    // Criando JSON que irá possuir os verbetes
    var json = {};

    // Leitura sincronizada da paste raiz dos verbetes
    var rootFolder = utils.readdirSync(rootPath);

    // Para cada pasta (estado) no diretorio raiz dos verbetes
    for (var i = 0; i < rootFolder.length; i++) {

        var estadoPath = path.join(rootPath, rootFolder[i]);
        var estadoFolder = utils.readdirSync(estadoPath);

        // Para cada verbete dentro do estado
        for (var j = 0; j < estadoFolder.length; j++) {
            var verbeteFolder = utils.readdirSync(path.join(estadoPath, estadoFolder[j]));

            json[estadoFolder[j]] = {
                id: estadoFolder[j],
                images: verbeteFolder,
                path: rootFolder[i] + '/' + estadoFolder[j],
                converted: [],
            };

        }
    }

    _saveJson({
        filename: outputName,
        jsonContent: _generateContent(json),
    });

    return true;
}

function _saveJson({filename, jsonContent}) {
    fs.writeFile(filename, jsonContent, err => {
        if (err) {
            console.log(err);
        } else {
            console.log('The JSON file was saved!');
        }
    });
}

function _generateContent(json, friendly=false) {
    var jsonContent;

    if (friendly) {
        jsonContent = JSON.stringify(json, null, '  ');
    } else {
        jsonContent = JSON.stringify(json);
    }

    return jsonContent.replace(/.tif/g, '');
}

export default generateJSON;
