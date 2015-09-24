(function() {
    'use strict';

    var gui = require('nw.gui');
    var os = require('os');
    var fs = require('fs');
    var nwUtil = require('../nw/util');

    var win = gui.Window.get();

    var TEMP_FOLDER = nwUtil.TEMP_FOLDER;

    init();

    angular.module('EtnosApp', [
      'ngRoute',
      'ngAnimate',
      'angular-carousel',
      'cfp.hotkeys',
      'ngAnimate',
      'ngProgress',
      'ui.bootstrap',

      'Lodash',
    ])
    .constant('nwUtilConstants', nwUtil);

    function init() {
        console.info('initializing the app...');

        _createTempFolder();
        _configureWindow();
    }

    function _createTempFolder() {
        console.info('creating temp folder...');

        //create tmpfolder if not exits
        if (!fs.existsSync(os.tmpDir())) {
            fs.mkdir(os.tmpDir());
        }

        if (!fs.existsSync(TEMP_FOLDER)) {
            fs.mkdir(TEMP_FOLDER);
        }
    }

    function _configureWindow() {
        console.info('configuring the window...');

        // Cancel all new windows (Middle clicks / New Tab)
        win.on('new-win-policy', function(frame, url, policy) {
            policy.ignore();
        });

        // Wipe the tmpFolder when closing the app (this frees up disk space)
        win.on('close', function() {
            try {

                // @TODO: Wipe temp folder.
                _deleteFolderRecursive(TEMP_FOLDER);
            } catch (err) {
                console.error(err);
            }

            win.close(true);
        });

        // Focus the window when the app opens
        win.focus();

        // Prevent dropping files into the window
        window.addEventListener('dragover', _preventDefault, false);
        window.addEventListener('drop', _preventDefault, false);

        // Prevent dragging files outside the window
        window.addEventListener('dragstart', _preventDefault, false);
    }

    var _deleteFolderRecursive = function(folder) {
        console.info('deleting the temp folder...');

        if (fs.existsSync(folder)) {
            fs.readdirSync(folder).forEach(function(file) {
                var curPath = folder + '/' + file;

                if (fs.lstatSync(curPath).isDirectory()) { // recurse
                    _deleteFolderRecursive(curPath);
                } else { // delete file
                    fs.unlinkSync(curPath);
                }
            });

            fs.rmdirSync(folder);
        }
    };

    var _preventDefault = function(e) {
        e.preventDefault();
    };

})();
