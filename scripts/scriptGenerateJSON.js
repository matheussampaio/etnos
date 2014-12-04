var path = require('path');
var fs = require('fs');


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

/** Inicio do codigo para ordenação das pastas de acordo com a ordem alfabetica **/
function strcmp(a, b) {
    return a > b ? 1 : a < b ? -1 : 0;
}


function natcmp(a, b) {
    var x = [], y = [];

    a.replace(/(\d+)|(\D+)/g, function($0, $1, $2) { x.push([$1 || 0, $2]) })
    b.replace(/(\d+)|(\D+)/g, function($0, $1, $2) { y.push([$1 || 0, $2]) })

    while(x.length && y.length) {
        var xx = x.shift();
        var yy = y.shift();
        var nn = (xx[0] - yy[0]) || strcmp(xx[1], yy[1]);
        if(nn) return nn;
    }

    if(x.length) return -1;
    if(y.length) return +1;

    return 0;
}
/** Fim do codigo para ordenação das pastas de acordo com a ordem alfabetica **/

if (process.argv.length < 3) {
  console.error("ERROR, missing args");
  return;
}

// Caminho do diretorio raiz dos verbetes
var root_path = process.argv[2];

// Criando JSON que irá possuir os verbetes
var json = {};

// Leitura sincronizada da paste raiz dos verbetes
var root_folder = fs.readdirSync(root_path).sort(natcmp);

// Para cada pasta (estado) no diretorio raiz dos verbetes
for (i in root_folder) {
  var estado_path = path.join(root_path, root_folder[i]);
  var estado_folder = fs.readdirSync(estado_path);

  // Para cada verbete dentro do estado
  for (j in estado_folder) {
    var verbete_folder = fs.readdirSync(path.join(estado_path, estado_folder[j])).sort(natcmp);

    json[estado_folder[j]] = {
      'id' : estado_folder[j],
      'images': verbete_folder,
      'path': '../files/' + root_folder[i] + '/' + estado_folder[j],
      "converted": []
    };

  }
}

fs.writeFile("verbetes.json", JSON.stringify(json, null, '  ').replace(/.tif/g, ''), function(err) {
    if(err) {
        console.log(err);
    } else {
        console.log("The JSON file was saved!");
    }
});