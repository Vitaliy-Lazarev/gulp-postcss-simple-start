//utils
const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const gutil = require('gulp-util');
const rename = require('gulp-rename');
const plumber = require('gulp-plumber');
const bower = require('gulp-bower');


//css
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');

//babel + browserify
const babel = require('gulp-babel');
const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');

//images
const imagemin = require('gulp-image');

const config = {
    bowerDir: './bower_components'
}


gulp.task('default', ['bower', 'sass', 'babel', 'imagemin'], () => {
    browserSync.init({
        server: {
            baseDir: "./dist"
        }
    });
    gulp.watch("./dist/userverifier/*.html").on('change', browserSync.reload);
    gulp.watch("./dist/backoffice/*.html").on('change', browserSync.reload);
    gulp.watch('./src/scss/**/*.scss', ['sass']);
    gulp.watch('./src/js/*.js', ['babel']);
    gulp.watch('./src/images/**/*.*', ['imagemin']);
    gulp.watch('./src/images/sprite/*.png', ['sprite']);
});

gulp.task('bower', () => {
    return bower()
        .pipe(gulp.dest(config.bowerDir))
})

gulp.task('sass', () => {
    const plugins = [autoprefixer({browsers: ['last 2 versions']}), cssnano()];
    return gulp.src('./src/scss/**/*.scss')
        .pipe(sass({
            includePaths: [
                config.bowerDir + '/bootstrap-sass-official/assets/stylesheets',
                config.bowerDir + '/fontawesome/scss',
            ]
        }).on('error', sass.logError))
        .pipe(postcss(plugins))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./dist/css'))
        .pipe(browserSync.stream());
});


gulp.task('imagemin', function () {
  gulp.src('./src/images/**/*.*')
    .pipe(imagemin())
    .pipe(gulp.dest('./dist/images/'));
});


gulp.task('babel', function() {
    browserify({
        entries: ['./src/js/vendor/jquery-1.11.1.min.js', './src/js/bootstrap.js', '../js/vendor/modernizr-2.8.3.min.js'],
        debug: true
    })
    .transform(babelify, { presets: ['env'] })
    .on('error',gutil.log)
    .bundle()
    .on('error',gutil.log)
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('dist/js'))
    .pipe(browserSync.stream());
});
