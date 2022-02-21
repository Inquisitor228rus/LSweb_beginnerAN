const { src, dest, task, series, watch } = require("gulp");
const rm = require("gulp-rm");
const sass = require('gulp-sass')(require('sass'));
const concat = require("gulp-concat");
const browserSync = require("browser-sync").create();
const reload = browserSync.reload;
const sassGlob = require("gulp-sass-glob");
const autoprefixer = require('gulp-autoprefixer');
const px2rem = require('gulp-smile-px2rem');
const gcmq = require('gulp-group-css-media-queries');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');

sass.compiler = require("node-sass");

// удаление содержимого в dist
task("clean", () => {
    return src("dist/**/*", {read: false }).pipe(rm());
});

// копирования сасс в dist
task("copy:scss", () => {
    return src("src/styles/*.scss").pipe(dest("dist"));
});

task("copy:html", () => {
    return src("src/*.html")
    .pipe(dest("dist"))
    .pipe(reload({stream: true}));
});

// список сасс файлов
const styles = [
    "node_modules/normalize.css/normalize.css",
    "src/styles/main.scss"
]

// склеивание сасс в папку dist
task("styles", () => {
    return src(styles)
    .pipe(sourcemaps.init())
    .pipe(concat("main.min.scss"))
    .pipe(sassGlob())
    .pipe(sass().on("error", sass.logError))
    // .pipe(px2rem())
    .pipe(autoprefixer({
        cascade: false
    }))
    // .pipe(gcmq())
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(sourcemaps.write())
    .pipe(dest("dist"))
    .pipe(reload({stream: true}));
});

// список сасс файлов
const jscript = [
    "node_modules/jquery/dist/jquery.js",
    "node_modules/bxslider/dist/jquery.bxslider.js",
    "node_modules/@fancyapps/fancybox/dist/jquery.fancybox.js",
    "./src/js/slider.js",
    "./src/js/fullscreen.js",
    "./src/js/modal.js",
    "./src/js/review.js",
    "./src/js/team.js"
]

// склеивание js в dist
task("script", () => {
    return src(jscript)
    .pipe(sourcemaps.init())
    .pipe(concat("main.min.js", {newLine: ";"}))
    .pipe(babel({
        presets: ['@babel/env']
    }))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(dest("dist"))
    .pipe(reload({stream: true}));
});

task("server", () => {
    browserSync.init({
        server: {
            baseDir: "./dist"
        },
        open: false
    });
});

watch("./src/js/**/*.js", series("script"));
watch("./src/styles/**/*.scss", series("styles"));
watch("./src/*.html", series("copy:html"));
// task("default", series("clean", "copy:scss", "styles", "server"));
task("default", series("clean", "copy:html", "styles", "script", "server"));