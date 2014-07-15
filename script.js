var 
im = require('imagemagick'),
// os object
os = require('os'),
// path object
path = require('path'),
// fs object
fs = require('fs'),
// TMP Folder		
tmpFolder = path.join(os.tmpDir(), 'historia');
//create tmpfolder if not exits
 fs.mkdir('.'+tmpFolder);
if( ! fs.existsSync(tmpFolder) ) { fs.mkdir(tmpFolder); }
var getFilePath = function(filepath, callback){
	var destFilePath = tmpFolder + '/'+filepath.replace(/\//gi, ".") + '.png';
console.log(destFilePath);
	im.convert(['-verbose', '.'+filepath, destFilePath],

	  function(err, stdout) {
	  if (err)
	    callback(null, err)
;	  else
	    callback(destFilePath);
});
}

var wipeTmpFolder = function() {
    if( typeof tmpFolder != 'string' ){ return; }
    fs.readdir(tmpFolder, function(err, files){
        for( var i in files ) {
            fs.unlink(tmpFolder+'/'+files[i]);
        }
    });
}


getFilePath('files/AL/1/1.TIF', function(filepath, err){
	if (err){
		//console.log(err);
	}else{
		console.log(filepath);
	}
})
