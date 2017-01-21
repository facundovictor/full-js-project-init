/*
 * Author : Facundo Victor <facundovt@gmail.com>
 *
 * This is a gulp script for:
 *   - Production build: Concatenate all js and css files and uglify them.
 *   - Add support for less, and autoprefixer.
 *   - Fast auto reload style changes (watcher)
 */

'use strict';

// Node imports
const fs = require('fs');

// Library imports
const gulp         = require('gulp'),
      watch        = require('gulp-watch'),
      concat       = require('gulp-concat'),
      uglify       = require('gulp-uglify'),
      less         = require('gulp-less'),
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

const js_src = './src/js/**/*.js';

// Concatenation and minification
gulp.task('js', () => {
  gulp.src(js_src)
    .pipe(concat('app.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./public/js/'));
});

// Copy the files
gulp.task('js_reload', () => {
  gulp.src(js_src)
    .pipe(gulp.dest('./public/js/'))
    .pipe(connect.reload());
});

/* Less **********************************************************************/
// Compilation task with connection reload for developing

const less_src = './src/less/**/*.less';

// Less production build task
gulp.task('less', () => {
  const processors = [ autoprefixer, cssnano ];

  gulp.src(less_src)
    .pipe(less())
    .pipe(postcss(processors))
    .pipe(gulp.dest('./public/css/'));
});

// Quick reload the browser on changes
gulp.task('less_reload', () => {
  const processors = [ autoprefixer ];

  gulp.src(less_src)
    .pipe(less())
    .pipe(postcss(processors))
    .pipe(gulp.dest('./public/css/'))
    .pipe(connect.reload());
});

/* HTML **********************************************************************/
const html_src = './src/html/**/*.html';

// Copy All dependencies
gulp.task('html', () => {
  gulp.src([ html_src ], {
    base: './src/html'
  }).pipe(gulp.dest('./public/'));
});

// Quick reload the browser on changes
gulp.task('html_reload', () => {
  gulp.src([ html_src ], {
    base: './src/html'
  }).pipe(gulp.dest('./public/'))
    .pipe(connect.reload());
});

/* Dependencies **************************************************************/

// Bootstrap
const bootstrap_src = './src/lib/bootstrap-3.3.7/**/*';

// Font Awesome
const font_awesome_src = './src/lib/font-awesome-4.7.0/**/*';

// Copy All dependencies
gulp.task('dependencies', () => {
  gulp.src([
    bootstrap_src,
    font_awesome_src
  ], {
    base: './src/lib'
  }).pipe(gulp.dest('./public/lib/'));
});

/* Global tasks **************************************************************/

// Clear the public folder
gulp.task('clear', () => {
  clearFolder('./public');
});

// Watch task
gulp.task('watch', function () {
  gulp.watch([js_src], ['js_reload']);
  gulp.watch([less_src], ['less_reload']);
  gulp.watch([html_src], ['html_reload']);
});

// Simple build
gulp.task('build', [
  'clear',
  'dependencies',
  'js',
  'html',
  'less'
]);

// Reloadable build, requires a previous connection
gulp.task('reloadable_build', [
  'clear',
  'dependencies',
  'html',
  'js_reload',
  'less_reload'
]);

// Build, Launch a server and watch for fast reload
gulp.task('development', [
  'connect',
  'reloadable_build',
  'watch'
]);

// Default task
gulp.task('default', ['build']);
