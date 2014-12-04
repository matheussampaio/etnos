var path = require('path');
var fs = require('fs');

var rename = function(parent, folder, new_name) {
  var old_folder = path.join(parent, folder);
  var new_folder = path.join(parent, new_name);

  // Renomeia o arquivo.
  if (old_folder != new_folder) {
    fs.renameSync(old_folder , new_folder);
  }

}

function zeroPad(num, places) {
  var zero = places - num.toString().length + 1;
  return Array(+(zero > 0 && zero)).join("0") + num;
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


if (process.length < 5) {
  console.error('Numero de argumentos errados.');
} else {
  var parent_dir = process.argv[2]
  var bk_num_begin = num_begin = process.argv[3];
  var num_end = process.argv[4];

  var files = fs.readdirSync(parent_dir);
  files = files.sort(natcmp);

  for (i in files) {
    var new_name = zeroPad(num_begin, 5)
    num_begin++;

    rename(parent_dir, files[i],  new_name);

    var verbete_folder = path.join(parent_dir, new_name);

    var tifs = fs.readdirSync(verbete_folder);

    var count_tifs = 0;

    for (j in tifs) {
      // console.log(j)
      count_tifs++;

      rename(verbete_folder, tifs[j], zeroPad(count_tifs, 5) + '.tif');
    }

    // if (count_tifs - tifs.length != 0) {
    //   console.error('error', parent_dir, 'tifs renamed dont match:', count_tifs, tifs.length);
    // } else {
    //   console.log(count_tifs, tifs.length)
    // }

  }

  if (num_begin - num_end != bk_num_begin) {
    console.error(parent_dir.split('/')[4], " ERROR", 'Numero de arquivos alterados errado. Deveria ter alterado ', num_end, ' porem alterou ', num_begin - bk_num_begin, '.');
  } else {
    console.log(parent_dir.split('/')[4], " renamed");
  }

}