const gulp = require('gulp');
const watch = require('gulp-watch');
const wait = require('gulp-wait');

const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const terser = require('gulp-terser');
const concat = require('gulp-concat');
const cssnano = require('gulp-cssnano');


function compileSass() {
    return gulp.src('sass/main.scss')
        .pipe(wait(100)) // becouse VS Code was making some problems with compiling on save
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'compressed',
            sourceComments: false,
        }).on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe( autoprefixer({
            browsers: ["last 3 versions", "iOS > 7", "Safari > 8", "Explorer >= 11"]
        }))
        .pipe(cssnano())
        .pipe(gulp.dest('./'))
        .pipe(browserSync.reload({
            stream: true
        }));
}


function startServer(callback) {
    browserSync.init({
        proxy: 'localhost/ksiegarnia',
        port: 3000,
    });
    callback();
}

//build minified js
function minifyJavaScript(){
    return gulp.src([
        './js/lib/jquery.min.js',
        './js/lib/bootstrap.bundle.min.js',
        './js/lib/slick.min.js',
        './js/sliders.js',
        ])
        .pipe(concat('app.js'))
        .pipe(terser())
        .pipe(gulp.dest('./'));
}

function watchFiles(callback) {
    watch('sass/**/*.scss', compileSass);
    watch('js/**/*.js', minifyJavaScript)
    watch(['./*.html', 'js/**/*.js','sass/**/*.scss'], browserSync.reload);
    callback();
}

//Tasks exported to public
exports.default = gulp.series(startServer, watchFiles);
exports.build = gulp.series(compileSass, minifyJavaScript);