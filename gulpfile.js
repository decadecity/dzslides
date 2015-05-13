/*jslint node: true */

var buffer = require('vinyl-buffer');
var gulp   = require('gulp');
var istanbul = require('gulp-istanbul');
var jasmine = require('gulp-jasmine');
var jshint = require('gulp-jshint');
var source = require('vinyl-source-stream');
var uglify = require('gulp-uglify');

var watching = false;

function onError(err) {
  console.log(err.toString());
  if (watching) {
    this.emit('end');
  } else {
    process.exit(1);
  }
}

var getBundleName = function () {
  var name = require('./package.json').name;
  return name;
};

gulp.task('lint', function() {
  return gulp
    .src(['gulpfile.js', 'js/*.js', 'test/*_test.js', '!js/jquery.js'])
    .pipe(jshint({'laxbreak': true}))
    .pipe(jshint.reporter('default'));
});

gulp.task('test', function(cb) {
  gulp.src(['js/*.js'])
    .pipe(istanbul()) // Covering files
    .on('finish', function () {
      gulp.src(['test/*_test.js'])
        .pipe(jasmine().on('error', onError))
        .pipe(istanbul.writeReports()) // Creating the reports after tests run
        .on('end', cb);
    });
});

gulp.task('watch', function() {
  gulp.watch(['src/*.js', 'js/*.js', 'test/*_test.js'], function() {
    watching = true;
    gulp.run('lint', 'test');
  });
});

gulp.task('default', ['lint', 'test', 'watch']);
