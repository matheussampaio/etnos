var path = require('path');
var fs = require('fs');

// Substituir acentos.
accentsTidy = function(s){
  var r = s.toLowerCase();
  r = r.replace(new RegExp("\\s", 'g'),"");
  r = r.replace(new RegExp("[àáâãäå]", 'g'),"a");
  r = r.replace(new RegExp("æ", 'g'),"ae");
  r = r.replace(new RegExp("ç", 'g'),"c");
  r = r.replace(new RegExp("[èéêë]", 'g'),"e");
  r = r.replace(new RegExp("[ìíîï]", 'g'),"i");
  r = r.replace(new RegExp("ñ", 'g'),"n");
  r = r.replace(new RegExp("[òóôõö]", 'g'),"o");
  r = r.replace(new RegExp("œ", 'g'),"oe");
  r = r.replace(new RegExp("[ùúûü]", 'g'),"u");
  r = r.replace(new RegExp("[ýÿ]", 'g'),"y");
  // r = r.replace(new RegExp("\\W", 'g'),"");
  return r;
};

// Formatar o texto.
var format = function (unformat) {
  var formated = accentsTidy(unformat.toLowerCase().trim().replace(/\s+/g, '_'));

  return formated;
}

var parent_dir = '/home/matheussampaio'
var dir_name = 'historia_indigena'

var rename = function(parent, folder) {
  var old_folder = path.join(parent, folder);
  var new_folder = path.join(parent, format(folder));

  // Renomeia o arquivo.
  fs.renameSync(old_folder , new_folder);

  // Se for diretorio, ler os arquivos filhos e chama recursivamente o rename para cada arquivo filho.
  if (fs.lstatSync(new_folder).isDirectory()) {
    var files = fs.readdirSync(new_folder);

    for (var i in files) {
      rename(new_folder, files[i]);
    }
  }
}

rename(parent_dir, dir_name);
