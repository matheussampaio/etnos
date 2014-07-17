var convert = require('./convert');

var json = {
  "id": "2",
  "snippet": "Verbete 2.",
  "path": "../../files/AL/2",
  "images": [ "1", "2" ]
};

convert.convertVerbete(json).done(function (results) {
  console.log(results);
}, function (err) {
  console.error(err);
});


