const { src, dest, task, series, watch } = require("gulp");
const rm = require("gulp-rm");
const sass = require('gulp-sass')(require('sass'));
const concat = require("gulp-concat");
const browserSync = require("browser-sync").create();
const reload = browserSync.reload;
const sassGlob = require("gulp-sass-glob");

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
    .pipe(concat("main.scss"))
    .pipe(sassGlob())
    .pipe(sass().on("error", sass.logError))
    .pipe(dest("dist"));
});

// список сасс файлов
const jscript = [
    "./src/js/jquery-3.6.0.min.js",
    "./src/js/jquery.fancybox.min.js",
    "./src/js/fullscreen.js",
    "./src/js/modal.js",
    "./src/js/review.js",
    "./src/js/slider.js",
    "./src/js/team.js"
]

// склеивание js в dist
task("script", () => {
    return src(jscript)
    .pipe(concat("main.js"))
    .pipe(dest("dist"));
});

task("server", () => {
    browserSync.init({
        server: {
            baseDir: "./dist"
        },
        open: false
    });
});

// watch("./src/js/**/*.js", series("script"));
watch("./src/styles/**/*.scss", series("styles"));
// watch("./src/*.html", series("copy:html"));
task("default", series("clean", "copy:scss", "styles", "server"));
// task("default", series("clean", "copy:scss", "copy:html", "styles", "script", "server"));