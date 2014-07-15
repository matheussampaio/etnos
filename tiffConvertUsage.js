var convert = require('./tiffConvert');
convert.getFilePath('files/AL/1/1.TIF', function(filepath, err){
	if (err){
		console.log(err);
		setTimeout( convert.wipeTmpFolder, 3000 );
	}else{
		console.log(filepath);
		// do anything with filepath
		//teste de lipeza apos 3 segundos ==> setTimeout( wipeTmpFolder, 3000 );
	}
});

//teste de lipeza apos 3 segundos ==> 
setTimeout( convert.wipeTmpFolder, 10000 );