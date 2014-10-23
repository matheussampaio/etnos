var path = require('path');
var fs = require('fs');

var parent_dir = '/home/matheussampaio/historia_indigena/x_codices' || process.argv[1];
var num_begin = 3046 || process.argv[2];
var num_end = 3118 || process.argv[3];

var rename = function(parent, folder, new_name) {
  console.log('->', folder, ' to ', new_name);

  var old_folder = path.join(parent, folder);
  var new_folder = path.join(parent, new_name);

  // Renomeia o arquivo.
  fs.renameSync(old_folder , new_folder);
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


var files = fs.readdirSync(parent_dir);
files = files.sort(natcmp);


for (i in files) {

  var verbete_folder = path.join(parent_dir, files[i]);

  var tifs = fs.readdirSync(verbete_folder);

  var count_tifs = 1;

  for (j in tifs) {
    rename(verbete_folder, tifs[j], count_tifs++ + '.tif');
  }
   rename(parent_dir, files[i], '' + num_begin++);

}

num_begin--;

if (num_begin != num_end) {
  console.error('Numero de arquivos alterados errado. Deveria ter alterado ', num_end, ' porem alterou ', num_begin, '.');
}