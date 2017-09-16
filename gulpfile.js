var gulp          = require('gulp'),
    connect       = require('gulp-connect'),
    postcss       = require('gulp-postcss'),
    sass          = require('gulp-sass'),
    autoprefixer  = require('autoprefixer'),
    mqpacker      = require('css-mqpacker'),
    rucksack      = require('gulp-rucksack'),
    notify        = require('gulp-notify'),
    plumber       = require('gulp-plumber');

// ===================================================
// Config
// ===================================================

var folder = {
  csssource: 'styles',
  cssdist: 'css',
  images: 'images'
};

var glob = {
  images: folder.images + '/**/*',
  css: folder.csssource + '/**/*.scss'
};

var onError = function(err) {
  notify.onError({
    title:    "Gulp error in " + err.plugin,
    message:  "<%= error.message %>",
    sound: "Beep"
  })(err);
  this.emit('end');
};

// ===================================================
// Set up a server
// ===================================================
gulp.task('connect', function() {
  connect.server({
    livereload: true,
    port: 5000
  });
});

// run this task by typing in gulp css in CLI
gulp.task('css', function () {
  var processors = [
    autoprefixer({browsers: ['last 2 versions']}),
    mqpacker({sort: true})
  ];

  var stream = gulp.src(glob.css)
    .pipe(plumber({
      errorHandler: onError
    }))
    .pipe( sass() )
    .pipe( postcss(processors) )
    .pipe( rucksack() )
    .pipe( gulp.dest(folder.cssdist) )
    .pipe( connect.reload() );
  return stream;
});

gulp.task('watch', function() {

  gulp.watch([
    glob.css
  ], ['css']);

});

gulp.task('default', ['css', 'connect', 'watch']);
