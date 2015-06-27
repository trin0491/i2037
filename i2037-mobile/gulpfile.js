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
var karma = require('gulp-karma');

var paths = {
  sass: ['scss/**/*.scss'],
  ts: ['app/js/**/*.ts', 'typings/**/*.d.ts'],
  tests: ['test/**/*.ts'],
  karma: [
    'www/lib/ionic/js/ionic.bundle.js',
    'node_modules/angular-mocks/angular-mocks.js',
    'www/js/**/*.js',
    'build/js/unit/**/*.spec.js'
  ]
};

var tsProject = ts.createProject({
  declarationFiles:false,
  noExternalResolve:true,
  sortOutput:true
});

gulp.task('default', ['sass', 'tsc', 'tsc-tests', 'test']);

function makeKarma(action) {
  return function() {
    return gulp.src(paths.karma)
      .pipe(karma({
        configFile: 'config/karma.conf.js',
        action: action
      }))
      .on('error', function(err) {
        throw err;
      });
  }
}

gulp.task('test', makeKarma('run'));
gulp.task('karma', makeKarma('watch'));

gulp.task('tsc', function() {
  var tsResult = gulp.src(paths.ts)
    .pipe(sourcemaps.init())
    .pipe(ts(tsProject));

  return tsResult.js
    .pipe(concat('i2037-mobile.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./www/js'));
})

gulp.task('tsc-tests', function() {
  var tsResult = gulp.src(paths.tests)
    .pipe(ts());

  return tsResult.js
    .pipe(gulp.dest('./build/js'));  
})

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
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
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.ts, ['tsc']);
  gulp.watch(paths.tests, ['tsc-tests'])
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
