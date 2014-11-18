// Logger
var logger = require('./js/log');

// Load native UI library
var config = require('./js/config');

logger.warn(config);

var gui = require('nw.gui');

var win = gui.Window.get();

// fs Object
var fs = require('fs');

// Focus the window when the app opens
win.focus();

// Cancel all new windows (Middle clicks / New Tab)
win.on('new-win-policy', function (frame, url, policy) {
    policy.ignore();
});


var deleteFolderRecursive = function(folder) {
    if ( fs.existsSync(folder) ) {
        fs.readdirSync(folder).forEach(function(file, index){
            var curPath = folder + "/" + file;

            if (fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });

        fs.rmdirSync(folder);
    }
};


// Wipe the tmpFolder when closing the app (this frees up disk space)
win.on('close', function(){
    try{
      logger.info('Closing app...');

      // @TODO: Wipe temp folder.
      logger.info('Wiping temp folder...');
      deleteFolderRecursive(config.TEMP_FOLDER);
    }catch(err){
      
    }
    win.close(true);
});

var preventDefault = function(e) {
    e.preventDefault();
}
// Prevent dropping files into the window
window.addEventListener("dragover", preventDefault, false);
window.addEventListener("drop", preventDefault, false);
// Prevent dragging files outside the window
window.addEventListener("dragstart", preventDefault, false);

var app = angular.module('verbeteApp', [
  'ngRoute',
  'ngAnimate',
  'verbeteControllers'
]);

app.config(['$routeProvider',
  function ($routeProvider) {

    $routeProvider
    .when('/home', {
      templateUrl: 'partials/home.html',
      controller: 'VerbeteListCtrl'
    })
    .when('/home/apresentacao', {
      templateUrl: 'partials/apresentacao.html',
      controller: 'VerbeteListCtrl'
    })
    .when('/home/fichatecnica', {
      templateUrl: 'partials/fichatecnica.html',
      controller: 'VerbeteListCtrl'
    })
    .when('/home/catalogo', {
      templateUrl: 'partials/catalogo.html',
      controller: 'VerbeteListCtrl'
    })
    .when('/home/help', {
      templateUrl: 'partials/help.html',
      controller: 'VerbeteListCtrl'
    })
    .when('/verbete/:verbeteId', {
      templateUrl: 'partials/verbete-detail.html',
      controller: 'VerbeteDetailCtrl'
    })
    .otherwise({
      redirectTo: '/home'
    });
  }
]);
