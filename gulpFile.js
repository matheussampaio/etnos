'use strict';

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')({
    lazy: true,
});
var del = require('del');
var path = require('path');
var yargs = require('yargs');
var stylish = require('jshint-stylish');
var streamqueue = require('streamqueue');
var runSequence = require('run-sequence');

/**
 * Parse arguments
 */
var args = yargs
    .boolean('release')
    .boolean('run')
    .alias('r', 'run')
    .default('platform', 'macos')
    .alias('p', 'platform')
    .boolean('proxy')
    .alias('x', 'proxy')
    .argv;

var config = {
    dist: 'www/',
    port: 8100,

    app: {
        src: 'app/',
        name: 'Etnos',
        concatName: 'app.js',
    },

    scss: {
        main: 'app/assets/scss/main.scss',
        src: ['app/components/**/*.scss', 'app/shared/**/*.scss'],

        concatName: 'main.css',
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

    iconfont: {
        src: 'app/assets/icons/*.svg',
        name: 'sppicons',
        template: 'app/assets/icons/iconfont.template',
        targetPath: '../css/spp-icons.css',
        fontPath: '../fonts/',
        dist: 'assets/fonts/',
    },

    images: {
        src: 'app/assets/images/**/*.*',
        dist: 'assets/images/',
    },

    vendors: {
        concatName: 'vendor.js',
        configFile: './vendor.json',
        debugDist: 'vendor/',
    },
};

gulp.task('build:clean', function(done) {
    del([
        config.dist + '/**/*',
        '!' + config.dist + '/.gitkeep',
    ], done);

});

gulp.task('build:scss', function() {
    return gulp.src(config.scss.main)
        .pipe(plugins.inject(gulp.src(config.scss.src), {
            read: false,
            starttag: '//- inject:{{ext}}',
            endtag: '//- endinject',
            transform: function(filepath) {
                return '@import "' + filepath + '";';
            },
            addRootSlash: false,
        }))
        .pipe(plugins.sass({
            style: args.release ? 'compressed' : 'expanded',
        }).on('error', function(err) {
            plugins.util.beep();
            plugins.util.log('sass', err.message);
            this.emit('end');
        }))
        .pipe(plugins.plumber({
            inherit: true,
        }))
        .pipe(plugins.autoprefixer('last 1 Chrome version', 'last 3 iOS versions', 'last 3 Android versions'))
        .pipe(plugins.concat(config.scss.concatName))
        .pipe(plugins.if(args.release, plugins.stripCssComments()))
        .pipe(plugins.if(args.release && !args.emulate, plugins.rev()))
        .pipe(gulp.dest(path.join(config.dist, config.scss.dist)));

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

gulp.task('build:js:release', function() {

    var minifyConfig = {
        collapseWhitespace: true,
        collapseBooleanAttributes: true,
        removeAttributeQuotes: true,
        removeComments: true,
    };

    var filterTemplate = plugins.filter('!template.js');

    // prepare angular template cache from html templates
    // (remember to change appName var to desired module name)
    var templateStream = gulp
        .src(config.templates.src, {cwd: config.app.src})
        .pipe(plugins.angularTemplatecache(config.templates.concatName, {
            module: config.app.name,
            htmlmin: args.release && minifyConfig,
        }));

    var scriptStream = gulp.src(config.js.src, {cwd: config.app.src});

    return streamqueue({objectMode: true}, scriptStream, templateStream)
        .pipe(plugins.plumber())
        .pipe(filterTemplate)
            .pipe(plugins.jshint())
            .pipe(plugins.jshint.reporter(stylish))
        .pipe(filterTemplate.restore())
        .pipe(plugins.replace(/(\/\/ gulp-inject-debug-mode)/g, 'DEBUG_MODE = false;'))
        .pipe(plugins.if(args.proxy, plugins.replace(/(\/\/ gulp-inject-proxy-mode)/g, 'PROXY_MODE = true;')))
        .pipe(plugins.babel())
        .pipe(plugins.ngAnnotate())
        .pipe(plugins.stripDebug())
        .pipe(plugins.concat(config.app.concatName))
        .pipe(plugins.uglify())
        .pipe(plugins.if(!args.emulate, plugins.rev()))
        .pipe(gulp.dest(config.dist));

});

gulp.task('build:fonts', function() {
    return gulp.src(config.fonts.src)
        .pipe(plugins.plumber())
        .pipe(gulp.dest(config.dist + config.fonts.dist));
});

gulp.task('build:iconfont', function() {
    return gulp.src(config.iconfont.src, { buffer: false })
        .pipe(plugins.plumber())
        .pipe(plugins.iconfontCss({
            fontName: config.iconfont.name,
            path: config.iconfont.template,
            targetPath: config.iconfont.targetPath,
            fontPath: config.iconfont.fontPath,
        }))
        .pipe(plugins.iconfont({
            fontName: config.iconfont.name,
            normalize: true,
        }))
        .pipe(gulp.dest(config.dist + config.iconfont.dist));
});

gulp.task('build:images', function() {
    return gulp.src(config.images.src)
        .pipe(plugins.plumber())
        .pipe(gulp.dest(config.dist + config.images.dist));
});

gulp.task('build:vendor', function() {
    var vendorFiles = require(config.vendors.configFile);

    if (args.release) {
        return gulp.src(vendorFiles)
            .pipe(plugins.plumber())
            .pipe(plugins.concat(config.vendors.concatName))
            .pipe(plugins.uglify())
            .pipe(plugins.rev())
            .pipe(gulp.dest(config.dist));

    } else {
        return gulp.src(vendorFiles)
            .pipe(plugins.plumber())
            .pipe(gulp.dest(config.dist + config.vendors.debugDist));
    }
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

    if (args.release) {
        return gulp.src('app/index.html')
            .pipe(plugins.plumber())

            // inject css
            .pipe(_inject(gulp.src(cssNaming, {cwd: config.dist}), 'app-styles'))

            // inject vendors
            .pipe(_inject(gulp.src('vendor*.js', {cwd: config.dist}), 'vendor'))

            // inject app.js
            .pipe(_inject(gulp.src('app*.js', {cwd: config.dist}), 'app'))

            .pipe(gulp.dest(config.dist));
    } else {
        var vendorFiles = require('./vendor.json');

        var vendorsBasename = vendorFiles.map(function(vendor) {
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
    }
});

gulp.task('lint:jscs', function() {
    return gulp.src(config.js.src, {cwd: config.app.src})
        .pipe(plugins.jscs())
        .on('error', function() {})
        .pipe(plugins.jscsStylish())
        .pipe(plugins.jscsStylish.combineWithHintResults())
        .pipe(plugins.jshint.reporter('gulp-checkstyle-jenkins-reporter', {
            filename: 'build/reports/jscs/jscs-checkstyle.xml',
            level: 'ewi',
        }));
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

gulp.task('build:js:debug', function() {
    return gulp.src(config.js.src, {cwd: config.app.src})
        .pipe(plugins.plumber())
        .pipe(plugins.changed(config.dist + config.app.src))
        .pipe(plugins.if(args.proxy, plugins.replace(/(\/\/ gulp-inject-proxy-mode)/g, 'PROXY_MODE = true;')))
        .pipe(plugins.babel())
        .pipe(plugins.ngAnnotate())
        .pipe(gulp.dest(config.dist + config.app.src));
});

gulp.task('debug:watchers', function() {
    gulp.watch(config.app.src + '**/*.scss', ['build:scss']);
    gulp.watch(config.app.src + 'assets/fonts/**', ['build:fonts']);
    gulp.watch(config.app.src + 'assets/icons/*.svg', ['build:iconfont']);
    gulp.watch(config.app.src + 'assets/images/**', ['build:images']);
    gulp.watch(config.app.src + '**/*.js', ['build:js:debug', 'lint:jshint', 'lint:jscs']);
    gulp.watch('./vendor.json', ['build:vendor']);
    gulp.watch([config.app.src + '**/*.html',
        '!' + config.app.src + '/index.html',
    ], plugins.if(args.release, ['build:js:release'], ['build:templates']));
    gulp.watch(config.app.src + 'index.html', ['build:inject']);
});

gulp.task('debug:js&template', ['build:js:debug', 'build:templates'], function() {});

gulp.task('build', function(done) {
    runSequence(
        'build:clean',
        'build:iconfont',
        'build:fonts',
        'build:scss',
        'build:images',
        'build:vendor',
        plugins.if(args.release, 'build:js:release', 'debug:js&template'),
        'lint:jshint',
        'lint:jscs',
        'build:inject',
        done);
});

gulp.task('debug', ['build'], function() {
    gulp.start('debug:watchers');
});
