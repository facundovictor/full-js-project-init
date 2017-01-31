/*
 * Author : Facundo Victor <facundovt@gmail.com>
 *
 * This is a gulp script for:
 *   - Production build: Concatenate all js and css files and uglify them.
 *   - Add support for sass, and autoprefixer.
 *   - Fast auto reload style changes (watcher)
 */

'use strict';

// Node imports
const fs = require('fs');

// Library imports
const gulp         = require('gulp'),
      watch        = require('gulp-watch'),
      concat       = require('gulp-concat'),
      uglify       = require('uglify-js'),
      minifier     = require('gulp-uglify/minifier'),
      sass         = require('gulp-sass'),
      postcss      = require('gulp-postcss'),
      cssnano      = require('gulp-cssnano'),
      autoprefixer = require('autoprefixer');

/* Helpers *******************************************************************/

function clearFolder (path, removeBaseDirectory=false) {

  if(fs.existsSync(path)) {
    fs.readdirSync(path).forEach((file, index) => {
      let curPath = `${path}/${file}`;

      if(fs.lstatSync(curPath).isDirectory()) {
        // Delete the folder and its content
        clearFolder(curPath, true);
      } else {
        // Delete the file
        fs.unlinkSync(curPath);
      }

    });

    if (removeBaseDirectory)
      fs.rmdirSync(path);
  }

};

/* Specific Tasks ************************************************************/

/* Server connection task, serves the browser with auto-reload for improving
 * productivity
 */
const connect = require('gulp-connect-multi')();
gulp.task('connect', connect.server({
  root: ['public'],
  port: 8080,
  livereload: true,
  open: {
    browser: 'google-chrome'
  }
}));

/* js ************************************************************************/
// Concatenation and minification

const js_src         = 'src/app/**/*.js',
      app_src        = 'src/app/app.js',
      services_src   = 'src/app/**/*Service.js',
      filters_src    = 'src/app/**/*Filter.js',
      directives_src = 'src/app/**/*Directive.js';

// Concatenation and minification
gulp.task('js', () => {
  // NOTE: The app.js should be first in order to be accessible to controllers
  gulp.src([
    app_src,
    services_src,
    directives_src,
    filters_src,
    js_src
  ])
    .pipe(concat('app.js'))
    .pipe(minifier({}, uglify))
    .pipe(gulp.dest('public/'));
});

// Copy the files
gulp.task('js_reload', () => {
  gulp.src([app_src, services_src, directives_src, js_src])
    .pipe(concat('app.js'))
    .pipe(gulp.dest('public/'))
    .pipe(connect.reload());
});

/* SASS **********************************************************************/
// Compilation task with connection reload for developing

const sass_src = 'src/assets/scss/**/*.scss',
      vars_src = 'src/assets/scss/variables.scss';

// Less production build task
gulp.task('sass', () => {
  gulp.src([vars_src, sass_src])
    .pipe(concat('all.scss'))
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([ autoprefixer ]))
    .pipe(cssnano())
    .pipe(concat('all.css'))
    .pipe(gulp.dest('public/css/'));
});

// Quick reload the browser on changes
gulp.task('sass_reload', () => {
  gulp.src([vars_src, sass_src])
    .pipe(concat('all.scss'))
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([ autoprefixer ]))
    .pipe(concat('all.css'))
    .pipe(gulp.dest('public/css/'))
    .pipe(connect.reload());
});

/* HTML **********************************************************************/
const html_src = 'src/app/**/*.html';

// Copy All dependencies
gulp.task('html', () => {
  gulp.src([ html_src ], {
    base: 'src/app'
  }).pipe(gulp.dest('public/'));
});

// Quick reload the browser on changes
gulp.task('html_reload', () => {
  gulp.src([ html_src ], {
    base: 'src/app'
  }).pipe(gulp.dest('public/'))
    .pipe(connect.reload());
});

/* Dependencies **************************************************************/

// Bootstrap
const bootstrap_src = 'src/assets/lib/bootstrap-3.3.7/**/*';

// Font Awesome
const font_awesome_src = 'src/assets/lib/font-awesome-4.7.0/**/*';

// Angular
const angular_src = 'src/assets/lib/angular/**/*';

// JQuery
const jquery_src = 'src/assets/lib/jquery.min.js';

// Copy All dependencies
gulp.task('dependencies', () => {
  gulp.src([
    jquery_src,
    angular_src,
    bootstrap_src,
    font_awesome_src
  ], {
    base: 'src/assets/lib'
  }).pipe(gulp.dest('public/lib/'));
});

/* Global tasks **************************************************************/

// Clear the public folder
gulp.task('clear', () => {
  clearFolder('public');
});

// Watch task
gulp.task('watch', function () {
  gulp.watch([js_src], ['js_reload']);
  gulp.watch([sass_src], ['sass_reload']);
  gulp.watch([html_src], ['html_reload']);
});

// Simple build
gulp.task('build', [
  'clear',
  'dependencies',
  'html',
  'js',
  'sass'
]);

// Reloadable build, requires a previous connection
gulp.task('reloadable_build', [
  'clear',
  'dependencies',
  'html',
  'js_reload',
  'sass_reload'
]);

// Build, Launch a server and watch for fast reload
gulp.task('development', [
  'connect',
  'reloadable_build',
  'watch'
]);

// Default task
gulp.task('default', ['build']);
