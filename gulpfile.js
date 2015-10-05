'use strict';

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')({
    lazy: true,
});
var del = require('del');
var path = require('path');
var runSequence = require('run-sequence');
var NwBuilder = require('nw-builder');

var config = {
    dist: 'www/',
    port: 8100,

    app: {
        src: 'app/',
        name: 'EtnosApp',
    },

    scss: {
        main: 'app/assets/scss/main.scss',
        src: ['app/components/**/*.scss', 'app/shared/**/*.scss'],

        dist: 'assets/css/',
    },

    templates: {
        src: ['components/**/*.html', 'shared/**/*.html'],
        concatName: 'templates.js',
        dist: 'app/',
    },

    js: {
        src: [
            'app.module.js',
            'app.config.js',
            '**/*.module.js',
            '**/*.config.js',
            '**/*.js',
            '!**/*.spec.js',
        ],
    },

    fonts: {
        src: ['app/assets/fonts/*.*', 'bower_components/ionic/release/fonts/*.*'],
        dist: 'assets/fonts/',
    },

    images: {
        src: 'app/assets/images/**/*.*',
        dist: 'assets/images/',
    },

    vendors: {
        filename: './vendor.json',
        debugDist: 'vendor/',
    },

    filesBuild: [
        './www/**',
        './node_modules/easy-zip/**',
        './node_modules/jade-pdf-redline/**',
        './node_modules/mkdirp/**',
        './nw/**',
        'package.json',
    ],

    filesCopy: [
        {
            from: './app/files/**',
            to: 'build/etnos/files',
        },
        {
            from: './app/js/imagemagick-macos/**',
            to: 'build/etnos/osx/imagemagick-macos',
        },
    ],
};

gulp.task('build:clean', function(done) {
    del([
        config.dist + '/**/*',
        '!' + config.dist + '/.gitkeep',
    ], done);
});

gulp.task('build:scss', function() {
    var vendorCSSFiles = require(config.vendors.filename).css;

    return gulp.src(config.scss.main)

        // Inject others .scss into main.scss
        .pipe(plugins.inject(gulp.src(config.scss.src), {
            read: false,
            starttag: '//- inject:{{ext}}',
            endtag: '//- endinject',
            transform: function(filepath) {
                return '@import "' + filepath + '";';
            },
            addRootSlash: false,
        }))

        // Compile SCSS
        .pipe(plugins.sass({
            style: 'expanded',
        }).on('error', function(err) {
            plugins.util.beep();
            plugins.util.log('sass', err.message);
            this.emit('end');
        }))

        // Add Plumber to pipe
        .pipe(plugins.plumber({
            inherit: true,
        }))

        // Inject Vendors CSS
        .pipe(plugins.addSrc(vendorCSSFiles))

        // Autoprefixer CSS
        .pipe(plugins.autoprefixer('last 1 Chrome version', 'last 3 iOS versions', 'last 3 Android versions'))
        .pipe(gulp.dest(path.join(config.dist, config.scss.dist)));

});

gulp.task('build:fonts', function() {
    return gulp.src(config.fonts.src)
        .pipe(plugins.plumber())
        .pipe(gulp.dest(config.dist + config.fonts.dist));
});

gulp.task('build:images', function() {
    return gulp.src(config.images.src)
        .pipe(plugins.plumber())
        .pipe(gulp.dest(config.dist + config.images.dist));
});

gulp.task('build:vendor', function() {
    var vendorJSFiles = require(config.vendors.filename).js;

    return gulp.src(vendorJSFiles)
        .pipe(plugins.plumber())
        .pipe(gulp.dest(config.dist + config.vendors.debugDist));
});

gulp.task('build:templates', function() {
    // prepare angular template cache from html templates
    // (remember to change appName var to desired module name)
    return gulp.src(config.templates.src, {cwd: config.app.src})
        .pipe(plugins.angularTemplatecache(config.templates.concatName, {
            module: config.app.name,
        }))
        .pipe(gulp.dest(config.dist + config.templates.dist));
});

gulp.task('build:js', function() {
    return gulp.src(config.js.src, {cwd: config.app.src})
        .pipe(plugins.plumber())
        .pipe(plugins.changed(config.dist + config.app.src))
        .pipe(plugins.babel())
        .pipe(plugins.ngAnnotate())
        .pipe(gulp.dest(config.dist + config.app.src));
});

gulp.task('build:inject', function() {

    // build has a '-versionnumber' suffix
    var cssNaming = 'assets/css/*.css';

    // injects 'src' into index.html at position 'tag'
    var _inject = function(src, tag) {
        return plugins.inject(src, {
            starttag: '<!-- inject:' + tag + ':{{ext}} -->',
            read: false,
            addRootSlash: false,
        });
    };

    var vendorFiles = require(config.vendors.filename);

    var vendorsBasename = vendorFiles.js.map(function(vendor) {
        return 'vendor/' + path.basename(vendor);
    });

    var scriptFiles = config.js.src.map(function(file) {
        return 'app/' + file;
    });

    var scriptStream = gulp.src(scriptFiles.concat(config.templates.dist + config.templates.concatName),
        {cwd: 'www'});

    return gulp.src('app/index.html')
        .pipe(plugins.plumber())

        // inject css
        .pipe(_inject(gulp.src(cssNaming, {cwd: config.dist}), 'app-styles'))

        // inject vendors
        .pipe(_inject(gulp.src(vendorsBasename, {cwd: config.dist}), 'vendor'))

        // inject app.js
        .pipe(_inject(scriptStream, 'app'))

        .pipe(gulp.dest(config.dist));

});

gulp.task('build:nw:compile', ['build'], function() {

    var nw = new NwBuilder({
        appName: 'Etnos',
        appVersion: '1.0.0',
        files: config.filesBuild,
        macIcns: 'favicon.ico',
        winIco: 'favicon.ico',
        version: '0.12.2',
        platforms: ['osx'], // change this to 'win' for/on windows
    });

    // Log stuff you want
    nw.on('log', console.log);

    // Build returns a promise, return it so the task isn't called in parallel
    return nw.build()
        .then(function() {
            console.log('build finished');
        }).catch(function(err) {
            console.error('error on build: ' + err.stack);
        });

});

gulp.task('build:nw:copy', function() {
    config.filesCopy.forEach(function(files) {
        gulp.src(files.from)
            .pipe(gulp.dest(files.to));
    });

    // gulp.src('./app/js/imagemagick-linux/**')
    //     .pipe(gulp.dest('build/etnos/linux64/imagemagick-linux'));
    //
    // gulp.src('./app/js/imagemagick-linux/**')
    //     .pipe(gulp.dest('build/etnos/linux32/imagemagick-linux'));
    //
    // gulp.src('./app/js/imagemagick-win/**')
    //     .pipe(gulp.dest('build/etnos/win32/imagemagick-win'));
    //
    // gulp.src('./app/js/imagemagick-win/**')
    //     .pipe(gulp.dest('build/etnos/win64/imagemagick-win'));
    //
    // gulp.src('./app/js/imagemagick-macos/**')
    //     .pipe(gulp.dest('build/etnos/osx/imagemagick-macos'));
});

gulp.task('lint:jscs', function() {
    return gulp.src(config.js.src, {cwd: config.app.src})
        .pipe(plugins.jscs())
        .on('error', function() {})
        .pipe(plugins.jscsStylish())
        .pipe(plugins.jscsStylish.combineWithHintResults());
});

gulp.task('lint:jshint', function() {
    return gulp.src(config.js.src, {cwd: config.app.src})
        .pipe(plugins.plumber())
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter('jshint-stylish'));
});

gulp.task('docs', function() {
    var command = [
        'node_modules/.bin/jsdoc',
        '--configure node_modules/angular-jsdoc/conf.json',   // config file
        '--template node_modules/angular-jsdoc/template',     // template file
        '--destination build/docs/',                          // output directory
        '--recurse app/',                                     // source code directory
        '--package ./package.json',                           // package.json file
        '--readme ./README.md',                               // to include README.md as index contents
    ].join(' ');

    return gulp.src('')
        .pipe(plugins.plumber())
        .pipe(plugins.shell(command));
}).help = 'Gerar documentação da aplicação.';

gulp.task('debug:watchers', function() {
    gulp.watch(config.app.src + '**/*.scss', ['build:scss']);
    gulp.watch(config.app.src + 'assets/fonts/**', ['build:fonts']);
    gulp.watch(config.app.src + 'assets/images/**', ['build:images']);
    gulp.watch(config.app.src + '**/*.js', ['build:js', 'lint:jshint', 'lint:jscs']);
    gulp.watch('./vendor.json', ['build:vendor']);
    gulp.watch([config.app.src + '**/*.html', '!' + config.app.src + '/index.html'], ['build:templates']);
    gulp.watch(config.app.src + 'index.html', ['build:inject']);
});

gulp.task('build', function(done) {
    runSequence(
        'build:clean',
        'build:fonts',
        'build:scss',
        'build:images',
        'build:vendor',
        'build:js',
        'build:templates',
        'lint:jshint',
        'lint:jscs',
        'build:inject',
        done);
});

gulp.task('debug', ['build'], function() {
    gulp.start('debug:watchers');
});
