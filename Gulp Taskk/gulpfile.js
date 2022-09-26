const gulp = require("gulp");
const { src, dest, watch, parallel, series } = require("gulp");

var globs = {
  html: "project/*.html",
  css: "project/css/**/*.css",
  img: "project/pics/*",
  js: "project/js/**/*.js",
};

const imagemin = require("gulp-imagemin");
function myimg() {
  return gulp.src(globs.img)
  .pipe(imagemin())
  .pipe(gulp.dest("dist/images"));
}
exports.img = myimg;

const htmlmin = require("gulp-htmlmin");
function myHTML() {
  return src(globs.html)
    .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
    .pipe(gulp.dest("dist"));
}
exports.html = myHTML;

const concat = require('gulp-concat');
const terser = require('gulp-terser');

function myJS() {
  return src(globs.js, { sourcemaps: true })
    .pipe(concat("all.min.js"))
    .pipe(terser())
    .pipe(dest("dist/assets/js", { sourcemaps: "." }));
}
exports.js = myJS;

const cleanCss = require("gulp-clean-css");
function myCSS() {
  return src(globs.css)
    .pipe(concat("style.min.css"))
    .pipe(cleanCss())
    .pipe(dest("dist/assets/css"));
}
exports.css = myCSS;

var browserSync = require('browser-sync');
function mySync (cb){
  browserSync({
    server: {
      baseDir: 'dist/'
    }
  });
  cb()
}

function reloadTask(done) {
  browserSync.reload()
  done()
}

function myWatch() {
    watch(globs.html, series(myHTML, reloadTask))
    watch(globs.js, series(myJS, reloadTask))
    watch(globs.css, series(myCSS,reloadTask));
    watch(globs.img, series(myimg,reloadTask));
}
exports.default = series( parallel(myimg, myHTML, myJS, myCSS), mySync , myWatch)

