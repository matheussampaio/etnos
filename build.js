var NwBuilder = require('node-webkit-builder');
var nw = new NwBuilder({
    version: '0.10.5',
    files: ['./**'], // use the glob format
    platforms: ['linux64', 'linux32', 'win', 'osx'],
    buildType: 'versioned',
    winIco: './favicon.ico',
    forceDownload: false
});

// Log stuff you want
nw.on('log',  console.log);

// Build returns a promise
nw.build().then(function () {
   console.log('all done!');
}).catch(function (error) {
    console.error(error);
});

// And supports callbacks
nw.build(function(err) {
    if(err) console.log(err);
})