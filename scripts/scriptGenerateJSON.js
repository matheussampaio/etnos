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

/** aqui **/
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
/** ate aqui **/

if (process.argv.length < 3) {
  console.error("ERROR");
  return;
}

var parent_dir = process.argv[2];

var json = {};

var files = fs.readdirSync(parent_dir).sort(natcmp);

for (i in files) {
  var verbete_folder = path.join(parent_dir, files[i]);
  var subfiles = fs.readdirSync(verbete_folder);

  for (j in subfiles) {
    var verbeteFiles = fs.readdirSync(path.join(verbete_folder, subfiles[j])).sort(natcmp);

    json[subfiles[j]] = { 'id' : subfiles[j], 'images': verbeteFiles, 'path': '../files/' + files[i] + '/' + subfiles[j], "snippet": "Verbete " + subfiles[j] + ".", "converted": []};

  }
}

fs.writeFile("verbetes.json", JSON.stringify(json, null, '  ').replace(/.tif/g, ''), function(err) {
    if(err) {
        console.log(err);
    } else {
        console.log("The JSON file was saved!");
    }
});