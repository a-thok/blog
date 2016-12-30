const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const plumber = require('gulp-plumber');
const gulpif = require('gulp-if');
const sourcemaps = require('gulp-sourcemaps');
const buble = require('gulp-buble');
const uglify = require('gulp-uglify');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssVariables = require('postcss-css-variables');
const pixrem = require('pixrem');
const cleanCSS = require('gulp-clean-css');

const isProd = process.env.NODE_ENV === 'production';
const sourcemapType = isProd ? './' : null;

gulp.task('js', () => (
  gulp.src('./src/js/*.js')
    .pipe(gulpif(!isProd, plumber()))
    .pipe(sourcemaps.init())
    .pipe(buble())
    .pipe(gulpif(isProd, uglify()))
    .pipe(sourcemaps.write(sourcemapType))
    .pipe(gulp.dest('./public/js'))
    .pipe(gulpif(!isProd, browserSync.stream()))
));

gulp.task('css', () => (
  gulp.src('./src/css/*.css')
    .pipe(gulpif(!isProd, plumber()))
    .pipe(sourcemaps.init())
    .pipe(postcss([
      autoprefixer(),
      cssVariables(),
      pixrem(),
    ]))
    .pipe(gulpif(isProd, cleanCSS()))
    .pipe(sourcemaps.write(sourcemapType))
    .pipe(gulp.dest('./public/css'))
    .pipe(gulpif(!isProd, browserSync.stream()))
));

gulp.task('server', ['js', 'css'], () => {
  browserSync.init({
    proxy: 'http://127.0.0.1:4000/',
  });

  gulp.watch('./src/js/*.js', ['js']);
  gulp.watch('./src/css/*.css', ['css']);
});

gulp.task('default', ['server']);

gulp.task('build', ['js', 'css']);
