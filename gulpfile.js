var gulp = require('gulp');
var source = require('vinyl-source-stream');
var compass = require('gulp-compass');
var minifyCSS = require('gulp-minify-css');
var browserify = require('browserify');
var watchify = require('watchify');
var reactify = require('reactify');

var isDebug = !(process.env.NODE_ENV === "production");

/* CSS */
gulp.task('styles', function() {
  gulp.src('sass/*.scss')
    .on('error', function(e) {
      console.log('Error! \n' + e);
      this.end();
    })
    .pipe(compass({
      css: './public/css',
      sass: './sass',
      image: './public/img'
    }))
    .pipe(minifyCSS())
    .pipe(gulp.dest('./public/css'));
});

/* JS */
var bundler = browserify({
  entries: ['./js/main.jsx'],
  transform: [reactify],
  debug: isDebug, // Sourcemapping
  cache: {},
  packageCache: {},
  fullPaths: true
});

function bundle() {
  return bundler.bundle()
    .on('error', function(e) {
      console.log('Error! \n' + e);
      this.end();
    })
    .pipe(source('main.js'))
    .pipe(gulp.dest('./public/js/'));
}

gulp.task('js', bundle);

/* Watch */
gulp.task('watch', function() {
  gulp.watch('./sass/*.scss', ['styles']);
  watchify(bundler).on('update', function() {
    var updateStart = Date.now();
    console.log('Updating...');
    bundle()
    console.log('Updated after', (Date.now() - updateStart), 'ms');
  });
});

/* Build - Use on production */
gulp.task('build', ['styles', 'js']);

/* Default - Use on dev */
gulp.task('default', ['build', 'watch']);
