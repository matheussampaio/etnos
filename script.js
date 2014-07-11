var im = require('imagemagick');

im.convert(['-verbose', 'files/AL/1/1.TIF', 'files/AL/1/1.png'],
  function(err, stdout) {
  if (err)
    console.error(err);
  else
    console.log('stdout:', stdout);
});