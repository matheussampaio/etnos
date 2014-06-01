var isDebug = true;

// Configuration variable
var applicationRoot = './';

// Load native UI library
var gui = require('nw.gui');

// browser window object
var win = gui.Window.get();

// os object
var os = require('os');

// path object
var path = require('path');

// fs object
var fs = require('fs');

// i18n module (translations)
var i18n = require("i18n");

var isWin = (process.platform === 'win32');
var isLinux = (process.platform === 'linux');
var isOSX = (process.platform === 'darwin');

var BUTTON_ORDER = ['close', 'min', 'max'];

if (isWin)   { BUTTON_ORDER = ['min', 'max', 'close']; }
if (isLinux) { BUTTON_ORDER = ['min', 'max', 'close']; }
if (isOSX)   { BUTTON_ORDER = ['close', 'min', 'max']; }

// Global App skeleton for backbone
var App = {
  Controller: {},
  View: {},
  Model: {},
  Page: {}
};

// render header buttons
// $("#header").html(_.template($('#header-tpl').html(), {buttons: BUTTON_ORDER}));


// Not debugging, hide all messages!
if (!isDebug) {
    console.log = function () {};
} else {
    // Developer Menu building
    var menubar = new gui.Menu({ type: 'menubar' }),
        developerSubmenu = new gui.Menu(),
        developerItem = new gui.MenuItem({
           label: 'Developer',
           submenu: developerSubmenu
        }),
        debugItem = new gui.MenuItem({
            label: 'Show developer tools',
            click: function () {
                win.showDevTools();
            }
        });
    menubar.append(developerItem);
    developerSubmenu.append(debugItem);
    win.menu = menubar;

    // Developer Shortcuts
    document.addEventListener('keydown', function(event){
        // F12 Opens DevTools
        if( event.keyCode == 123 ) { win.showDevTools(); }
        // F11 Reloads
        if( event.keyCode == 122 ) { win.reloadIgnoringCache(); }
    });
}


// Set the app title (for Windows mostly)
win.title = 'Com.Tudo';

// Focus the window when the app opens
win.focus();

// Cancel all new windows (Middle clicks / New Tab)
win.on('new-win-policy', function (frame, url, policy) {
    policy.ignore();
});

var preventDefault = function(e) {
    e.preventDefault();
}
// Prevent dropping files into the window
window.addEventListener("dragover", preventDefault, false);
window.addEventListener("drop", preventDefault, false);
// Prevent dragging files outside the window
window.addEventListener("dragstart", preventDefault, false);

/**
 * Show 404 page on uncaughtException
 */
process.on('uncaughtException', function(err) {
    if (console) {
        console.log(err);
    }
});