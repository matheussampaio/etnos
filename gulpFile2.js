var NwBuilder = require('node-webkit-builder');
var gulp = require('gulp');
var gutil = require('gulp-util');
var clean = require('gulp-clean');
var preprocess = require('gulp-preprocess');
var fs = require('fs-extra');

var filesBuild = [
    './app/css/**',
    './app/fonts/**',
    './app/img/**',
    './app/js/lib/**',
    './app/js/*.js',
    './app/partials/**',
    './app/verbetes/**',
    './app/index.html',
    './node_modules/easy-zip/**',
    './node_modules/jade-pdf-redline/**',
    './node_modules/mkdirp/**',
    './node_modules/promise/**',
    './node_modules/q/**',
    './node_modules/winston/**',
    'package.json',
    'favicon.ico'
];

gulp.task('clean', function () {
    return gulp.src('build', {read: false})
        .pipe(clean());
});

gulp.task('build', ['clean'], function () {

    gulp.src('./app/js/config.js')
        .pipe(preprocess({context: { NODE_ENV: 'production', DEBUG: false }})) //To set environment variables in-line
    
    pack = fs.readJsonSync('package.json');
    
    pack.window.toolbar = false; 
    fs.writeJsonSync('package.json', pack);

    var nw = new NwBuilder({
        appName: 'Etnos',
        appVersion: '0.0.1',
        files: filesBuild,
        platforms: ['linux', 'win'] // change this to 'win' for/on windows
    });

    // Log stuff you want
    nw.on('log', function (msg) {
        gutil.log('node-webkit-builder', msg);
    });

    // Build returns a promise, return it so the task isn't called in parallel
    return nw.build().then(function () {
        pack.window.toolbar = true; 
        fs.writeJsonSync('package.json', pack);
    }).catch(function (err) {
        gutil.log('node-webkit-builder', err);
    });

});

gulp.task('move', ['build'], function() {
    gulp.src('./app/js/imagemagick-linux/**')
        .pipe(gulp.dest('build/etnos/linux64/imagemagick-linux'));

    gulp.src('./app/js/imagemagick-linux/**')
        .pipe(gulp.dest('build/etnos/linux32/imagemagick-linux'));

    gulp.src('./app/js/imagemagick-win/**')
        .pipe(gulp.dest('build/etnos/win32/imagemagick-win'));

    gulp.src('./app/js/imagemagick-win/**')
        .pipe(gulp.dest('build/etnos/win64/imagemagick-win'));

    gulp.src('./app/js/imagemagick-macos/**')
        .pipe(gulp.dest('build/etnos/osx/imagemagick-macos'));

    gulp.src('./app/files/**')
        .pipe(gulp.dest('build/etnos/files'))
});

gulp.task('dist', ['move']);