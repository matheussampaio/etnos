// Load native UI library
var gui = require('nw.gui');

var win = gui.Window.get();

// Focus the window when the app opens
win.focus();

// Cancel all new windows (Middle clicks / New Tab)
win.on('new-win-policy', function (frame, url, policy) {
    policy.ignore();
});

// Wipe the tmpFolder when closing the app (this frees up disk space)
win.on('close', function(){
    console.log('Closing app...');

    // @TODO: Wipe temp folder.
    console.log('Wiping temp folder...');

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
    $routeProvider.when('/verbetes', {
      templateUrl: 'partials/verbete-list.html',
      controller: 'VerbeteListCtrl'
    }).
    when('/verbete/:verbeteId', {
      templateUrl: 'partials/verbete-detail.html',
      controller: 'VerbeteDetailCtrl'
    }).
    otherwise({
      redirectTo: '/verbetes'
    });

  }
]);