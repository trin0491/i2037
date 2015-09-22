var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var ts = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');
var karma = require('karma').server;
var del = require('del');
var path = require('path');

var paths = {
  app: {
    base: 'app/js',
    src: ['app/js/**/*'],
    ts: ['./www/js/**/*.ts', './typings/**/*.d.ts'],
    dest: "./www/js"
  },
  test: {
    base: 'test',
    src: ['test/**/*'],
    ts: ['./www/js/**/*.ts', './test/**/*.ts', './typings/**/*.d.ts' ],
    dest: "./test"
  },
  styles: {
    sass: ['scss/**/*.scss']
  }
};

var appProject = ts.createProject({
  declarationFiles:false,
  noExternalResolve:true,
  sortOutput:false,
  module:'amd',
  target:'es5'
});

var testProject = ts.createProject({
  declarationFiles:false,
  noExternalResolve:true,
  sortOutput:false,
  module:'amd',
  target:'es5'
});

gulp.task('default', ['copy', 'sass', 'tsc', 'tsc:test', 'test']);

function makeKarma(singleRun) {
  return function(done) {
    karma.start({
        configFile: __dirname + '/config/karma.conf.js',
        singleRun: singleRun
      }, done);
  }
}

gulp.task('clean', function () {
  return del([
    paths.app.dest + '/**/*.js',
    paths.app.dest + '/**/*.js.map',
    paths.test.dest + '/**/*.js',
    paths.test.dest + '/**/*.js.map',
  ]);
});

gulp.task('test', ['tsc'], makeKarma(true));
gulp.task('karma', makeKarma(false));

gulp.task('copy:app', ['clean'], function() {
  return gulp.src(paths.app.src, {base: paths.app.base})
  .pipe(gulp.dest(paths.app.dest));
});

gulp.task('copy:test', ['clean'], function() {
  return gulp.src(paths.test.src, {base: paths.test.base})
    .pipe(gulp.dest(paths.test.dest));
});
gulp.task('copy', ['copy:app', 'copy:test']);

gulp.task('tsc:app', ['copy'], function() {
  var tsResult = gulp.src(paths.app.ts, {base: paths.app.dest})
    .pipe(sourcemaps.init())
    .pipe(ts(appProject));

  return tsResult.js
    //.pipe(concat('i2037-mobile.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.app.dest));
})

gulp.task('tsc:test', ['copy', 'tsc:app'], function() {
  var tsResult = gulp.src(paths.test.ts, {base: paths.test.base})
    .pipe(sourcemaps.init())
    .pipe(ts(testProject));

  return tsResult.js
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.test.dest));
})

gulp.task('tsc', ['tsc:app', 'tsc:test']);

gulp.task('sass', function(done) {
  gulp.src(paths.styles.sass)
    .pipe(sass({
      errLogToConsole: true
    }))
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('watch', function() {
  gulp.watch(paths.styles.sass, ['sass']);
  //gulp.watch(paths.app.ts, ['tsc']);
  //gulp.watch(paths.test.ts, ['tsc:test'])
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});
