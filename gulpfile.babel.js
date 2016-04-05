'use strict';

import gulp from 'gulp';
import sequence from 'run-sequence';
import gulpLoadPlugins from 'gulp-load-plugins';
import browserSync from 'browser-sync';

let plugins = gulpLoadPlugins();

const DIRS = {
  src: 'src',
  build: 'build',
  dist: 'dist',
  js: { app: 'js/bubble-matrix.js', min: 'js/bubble-matrix.min.js', libs: 'js/libs.js' }
};

const JS_DEPENDENCIES = [
  'node_modules/d3/d3.js',
  'node_modules/d3-tip/index.js'
];

const CSS_DEPENDENCIES = [];

const PATHS = {
  sass: [`${DIRS.src}/scss/*.scss`, `${DIRS.src}/scss/**/*.scss`],
  js: [`${DIRS.src}/js/*.js`, `${DIRS.src}/js/**/*.js`]
};

// Handle sass changes.
gulp.task('sass', done => {
  return gulp.src(PATHS.sass)
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.sass())
    .pipe(plugins.concat('css/bubble-matrix.min.css'))
    .pipe(plugins.cleanCss())
    .pipe(plugins.sourcemaps.write(`../${DIRS.build}`))
    .pipe(gulp.dest(DIRS.build))
    .pipe(browserSync.stream({match: '**/*.css'}));
});

// Handle js changes.
gulp.task('js', done => {
  return gulp.src(PATHS.js)
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.babel())
    .pipe(plugins.concat(DIRS.js.app))
    .pipe(plugins.sourcemaps.write())
    .pipe(gulp.dest(DIRS.build))
    .pipe(browserSync.stream({match: '**/*.js'}))
    .on('end', () => {
      gulp
        .src(JS_DEPENDENCIES)
        .pipe(plugins.concat(DIRS.js.libs))
        .pipe(gulp.dest(DIRS.build));
    });
});

// Minify js
gulp.task('minifyJS', done => {
  return gulp
    .src(PATHS.js)
    .pipe(plugins.concat(DIRS.js.app))
    .pipe(plugins.babel())
    .pipe(plugins.uglify())
    .pipe(gulp.dest(DIRS.build))
    .on('end', () => {
      gulp
        .src(JS_DEPENDENCIES)
        .pipe(plugins.concat(DIRS.js.libs))
        .pipe(plugins.uglify())
        .pipe(gulp.dest(DIRS.build));
    });
});

// Start the development sever task.
gulp.task('server', () => {
  browserSync({
    notify: false,
    server: DIRS.build,
    // open: false,
    tunnel: false,
    browser: "google chrome",
    port: 8000
  });
});

// Task for watching file changes and livereloading the development server.
gulp.task('watch', cb => {
  sequence(['sass', 'js', 'html'], ['server', 'watching'], cb);
});

gulp.task('watching', () => {
  gulp.watch(PATHS.js, ['js']);
  gulp.watch(PATHS.sass, ['sass']);
});

// Gulp default task.
gulp.task('default', ['watch']);

gulp.task('html', () => {
  return gulp.src(`${DIRS.src}/index.html`)
    .pipe(gulp.dest(DIRS.build));
});
// Build command
gulp.task('build', ['sass', 'minifyJS', 'html']);

// Generate distribution.
gulp.task('dist', () => {
  // JS
  gulp.src(`${DIRS.src}/${DIRS.js.app}`)
    .pipe(plugins.babel())
    .pipe(plugins.concat(DIRS.js.app))
    .pipe(gulp.dest(DIRS.dist));

  // JS MIN
  gulp.src(`${DIRS.src}/${DIRS.js.app}`)
    .pipe(plugins.babel())
    .pipe(plugins.uglify())
    .pipe(plugins.concat(DIRS.js.min))
    .pipe(gulp.dest(DIRS.dist));

  // SASS
  gulp.src(PATHS.sass)
    .pipe(plugins.sass())
    .pipe(plugins.concat('css/bubble-matrix.css'))
    .pipe(gulp.dest(DIRS.dist));

  // SASS MIN
  gulp.src(PATHS.sass)
    .pipe(plugins.sass())
    .pipe(plugins.concat('css/bubble-matrix.min.css'))
    .pipe(plugins.cleanCss())
    .pipe(gulp.dest(DIRS.dist));
});
