require('babel/register');

var path = require('path');
var generate = require('./generate-json');
var formatFilenames = require('./format-filenames');
var renameFolders = require('./rename-folders');

/* Variables */
var parentPath = '/Users/matheussampaio/historia/chien';
var folderName = '/historia_indigena';
var outputName = 'files/verbetes.json';
var verbetes = [
    {
        name: 'alagoas',
        begin: 1,
        end: 7,
    },
    {
        name: 'bahia',
        begin: 8,
        end: 146,
    },
    {
        name: 'bahia_ca',
        begin: 147,
        end: 199,
    },
    {
        name: 'bahia_lf',
        begin: 200,
        end: 251,
    },
    {
        name: 'ceara',
        begin: 252,
        end: 285,
    },
    {
        name: 'espirito_santo',
        begin: 286,
        end: 298,
    },
    {
        name: 'goias',
        begin: 299,
        end: 467,
    },
    {
        name: 'maranhao',
        begin: 468,
        end: 1056,
    },
    {
        name: 'mato_grosso',
        begin: 1057,
        end: 1217,
    },
    {
        name: 'minas_gerais',
        begin: 1218,
        end: 1309,
    },
    {
        name: 'para',
        begin: 1310,
        end: 2160,
    },
    {
        name: 'paraiba',
        begin: 2161,
        end: 2225,
    },
    {
        name: 'pernambuco',
        begin: 2226,
        end: 2445,
    },
    {
        name: 'piaui',
        begin: 2446,
        end: 2515,
    },
    {
        name: 'rio_da_prata',
        begin: 2516,
        end: 2529,
    },
    {
        name: 'rio_de_janeiro',
        begin: 2530,
        end: 2664,
    },
    {
        name: 'rio_de_janeiro_ca',
        begin: 2665,
        end: 2763,
    },
    {
        name: 'rio_grande_do_norte',
        begin: 2764,
        end: 2793,
    },
    {
        name: 'rio_grande_do_sul',
        begin: 2794,
        end: 2805,
    },
    {
        name: 'rio_negro',
        begin: 2806,
        end: 2899,
    },
    {
        name: 'santa_catarina',
        begin: 2900,
        end: 2905,
    },
    {
        name: 'sao_paulo',
        begin: 2906,
        end: 2916,
    },
    {
        name: 'sao_paulo_mg',
        begin: 2917,
        end: 3043,
    },
    {
        name: 'sergipe',
        begin: 3044,
        end: 3045,
    }
];

/* Removing special characters from file names */
console.info('Formating file names...');
formatFilenames({
    parentFolder: parentPath,
    filename: folderName,
});
console.info('File names formated.');

/* Renaming file/folder names */
console.info('Renaming folders...');
verbetes.forEach(function(verbeteFolder) {
    console.info('\tRenaming ' + verbeteFolder.name + '...');
    renameFolders({
        parentDir: path.join(parentPath, folderName, verbeteFolder.name),
        numBegin: verbeteFolder.begin,
        numEnd: verbeteFolder.end,
    });
    console.info('\t' + verbeteFolder.name, 'renamed.');
});
console.info('Folders renamed');

/* Generating and saving json file */
console.info('Generating JSON file...');
generate({
    rootPath: path.join(parentPath, folderName),
    outputName: outputName,
});
console.info('JSON file generated');
