const { src, dest, task, series, watch, parallel } = require("gulp");
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
const svgo = require('gulp-svgo');
const svgSprite = require('gulp-svg-sprite');
const gulpif = require("gulp-if");

const env = process.env.NODE_ENV;

const { DIST_PATH, SRC_PATH, STYLES_LIBS, JS_LIBS, SVG_LIBS } = require("./gulp.config");

sass.compiler = require("node-sass");

task("icons", () => {
    return src(`${SRC_PATH}/images/svg/*.svg`)
        .pipe(svgo({
            plugins: [
                {
                    removeAttrs: {
                        attrs: "(fill|stroke|style|width|height|data.*)"
                    }
                }
            ]
        }))
        .pipe(svgSprite({
            mode: {
                symbol: {
                    sprite: "../sprite.svg"
                }
            }
        }))
        .pipe(dest(`${DIST_PATH}/img/svg`));
})

// удаление содержимого в dist
task("clean", () => {
    console.log(env);
    return src(`${DIST_PATH}/**/*`, { read: false }).pipe(rm());
});

// копирования сасс в dist
task("copy:scss", () => {
    return src(`${SRC_PATH}/styles/*.scss`).pipe(dest(`${DIST_PATH}`));
});

task("copy:img", () => {
    return src(`${SRC_PATH}/images/**/*.png`).pipe(dest(`${DIST_PATH}/img`));
});

const svglibs = [
    "./src/images/svg/ear.svg",
    "./src/images/svg/battery.svg",
    "./src/images/svg/fastchrg.svg",
    "./src/images/svg/arrow.svg"
]

task("copy:addSvg", () => {
    return src(svglibs).pipe(dest(`${DIST_PATH}/img/svg`));
});

task("copy:html", () => {
    return src(`${SRC_PATH}/*.html`)
        .pipe(dest(`${DIST_PATH}`))
        .pipe(reload({ stream: true }));
});

// склеивание сасс в папку dist
task("styles", () => {
    return src([...STYLES_LIBS, "src/styles/main.scss"])
        .pipe(gulpif(env === "dev", sourcemaps.init()))
        .pipe(concat("main.min.scss"))
        .pipe(sassGlob())
        .pipe(sass().on("error", sass.logError))
        // .pipe(px2rem())
        .pipe(gulpif(env === "dev", autoprefixer({
            cascade: false
        })))
        .pipe(gulpif(env === "prod", gcmq()))
        .pipe(gulpif(env === "prod", cleanCSS({ compatibility: 'ie8' })))
        .pipe(gulpif(env === "dev", sourcemaps.write()))
        .pipe(dest("dist"))
        .pipe(reload({ stream: true }));
});

// список сасс файлов
const jscript = [
    "./src/js/slider.js",
    "./src/js/fullscreen.js",
    "./src/js/modal.js",
    "./src/js/review.js",
    "./src/js/team.js"
]

// склеивание js в dist
task("script", () => {
    return src([...JS_LIBS])
        .pipe(gulpif(env === "dev", sourcemaps.init()))
        .pipe(concat("main.min.js", { newLine: ";" }))
        .pipe(gulpif(env === "dev", babel({
            presets: ['@babel/env']
        })))
        .pipe(gulpif(env === "prod", uglify()))
        .pipe(sourcemaps.write())
        .pipe(dest("dist"))
        .pipe(reload({ stream: true }));
});

task("server", () => {
    browserSync.init({
        server: {
            baseDir: "./dist"
        },
        open: false
    });
});

task("watch", () => {
    watch("./src/js/**/*.js", series("script"));
    watch("./src/styles/**/*.scss", series("styles"));
    watch("./src/*.html", series("copy:html"));
    watch("./src/images/svg/*.svg", series("icons"));
})


// task("default", series("clean", "copy:scss", "styles", "server"));
task("default", series("clean", parallel("copy:html", "styles", "icons", "copy:img", "copy:addSvg", "script"), parallel("watch", "server")));
task("build", series("clean", parallel("copy:html", "styles", "icons", "copy:img", "copy:addSvg", "script")));