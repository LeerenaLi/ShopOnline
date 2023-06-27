import gulp from 'gulp';
import browserSync from 'browser-sync';
import * as sassPkg from 'sass';
import gulpSass from 'gulp-sass';
import gulpCssimport from 'gulp-cssimport';
import {deleteAsync} from 'del';
import htmlmin from 'gulp-htmlmin';
import cleanCss from 'gulp-clean-css';
import terser from 'gulp-terser';
import concat from 'gulp-concat';
import sourcemaps from 'gulp-sourcemaps';
import gulpImage from 'gulp-image';
import gulpwebp from 'gulp-webp';
import gulpavif from 'gulp-avif';
import {stream as critical} from 'critical';
import gulpif from 'gulp-if';
import autoprefixer from 'gulp-autoprefixer';
import babel from 'gulp-babel';

const prepros = true;

let dev = false;

const sass = gulpSass(sassPkg);

const allJS = [
    'src/js/timer.js',
    'src/js/blog.js',
    'src/js/menu.js',
    'src/js/renderCategoryGoods.js',
];

// tasks

export const html = () => gulp
        .src('src/*.html')
        .pipe(htmlmin({
            removeComments: true,
            collapseWhitespace: true,
        }))
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.stream());

export const style = () => {
    if (prepros) {
        return gulp
                .src('src/scss/**/*.scss')
                .pipe(gulpif(dev, sourcemaps.init()))
                .pipe(sass().on('error', sass.logError))
                .pipe(autoprefixer())
                .pipe(cleanCss({
                    2: {
                        specialComments: 0,
                    },
                }))
                .pipe(concat('index.min.css'))
                .pipe(gulpif(dev, sourcemaps.write('../maps')))
                .pipe(gulp.dest('dist/css'))
                .pipe(browserSync.stream());
    }

    return gulp
            .src('src/css/index.min.css')
            .pipe(gulpif(dev, sourcemaps.init()))
            .pipe(gulpCssimport({
                extensions: ['css'],
            }))
            .pipe(autoprefixer())
            .pipe(cleanCss({
                2: {
                    specialComments: 0,
                },
            }))
            .pipe(gulpif(dev, sourcemaps.write('../maps')))
            .pipe(gulp.dest('dist/css'))
            .pipe(browserSync.stream());
};

export const js = () => gulp
        .src([...allJS, 'src/js/**/*.js'])
        // .pipe(gulpif(dev, sourcemaps.init()))
        // .pipe(babel({
        //     presets: ['@babel/preset-env'],
        //     ignore: [...allJS, 'src/js/**/*.min.js'],
        // }))
        // .pipe(terser())
        // // .pipe(concat('index.min.js'))
        // .pipe(gulpif(dev, sourcemaps.write('../maps')))
        .pipe(gulp.dest('dist/js'))
        .pipe(browserSync.stream());

export const img = () => gulp
        .src('src/img/**/*.{jpg,jpeg,png,svg,gif}')
        .pipe(gulpif(!dev, gulpImage({
            optipng: ['-i 1', '-strip all', '-fix', '-o7', '-force'],
            pngquant: ['--speed=1', '--force', 256],
            zopflipng: ['-y', '--lossy_8bit', '--lossy_transparent'],
            jpegRecompress: ['--strip', '--quality', 'medium', '--min', 40, '--max', 80],
            mozjpeg: ['-optimize', '-progressive'],
            gifsicle: ['--optimize'],
            svgo: true,
        })))
        .pipe(gulp.dest('dist/img'))
        .pipe(browserSync.stream());

export const icons = () => gulp
        .src('src/icons/**/*.{jpg,jpeg,png,svg,gif}')
        .pipe(gulpif(!dev, gulpImage({
            optipng: ['-i 1', '-strip all', '-fix', '-o7', '-force'],
            pngquant: ['--speed=1', '--force', 256],
            zopflipng: ['-y', '--lossy_8bit', '--lossy_transparent'],
            jpegRecompress: ['--strip', '--quality', 'medium', '--min', 40, '--max', 80],
            mozjpeg: ['-optimize', '-progressive'],
            gifsicle: ['--optimize'],
            svgo: true,
        })))
        .pipe(gulp.dest('dist/icons'))
        .pipe(browserSync.stream());

export const webp = () => gulp
        .src('src/img/**/*.{jpg,jpeg,png}')
        .pipe(gulpwebp({
            quality: 75,
        }))
        .pipe(gulp.dest('dist/img'))
        .pipe(browserSync.stream());

export const avif = () => gulp
        .src('src/img/**/*.{jpg,jpeg,png}')
        .pipe(gulpavif({
            quality: 65,
        }))
        .pipe(gulp.dest('dist/img'))
        .pipe(browserSync.stream());

export const critCSS = () => gulp
        .src('dist/*html')
        .pipe(critical({
            base: 'dist/',
            inline: true,
            css: ['dist/css/index.min.css'],
        }))
        .on('error', err => {
            console.log(err.message);
        })
        .pipe(gulp.dest('dist'));

export const copy = () => gulp
        .src([
            'src/fonts/**/*',
        ], {
            base: 'src',
        })
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.stream({
            once: true,
        }));

export const server = () => {
    browserSync.init({
        ui: false,
        notify: false,
        // tunnel: true,   // используется, когда нужно показать сайт заказчику
        server: {
            baseDir: 'dist',
        },
    });

    gulp.watch('./src/**/*.html', html);
    gulp.watch(prepros ? './src/scss/**/*.scss' : './src/css/**/*.css', style);
    gulp.watch('./src/img/**/*.{jpg,jpeg,png,svg,gif}', img);
    gulp.watch('./src/icons/**/*.{jpg,jpeg,png,svg,gif}', icons);
    gulp.watch('./src/js/**/*.js', js);
    gulp.watch('./src/fonts/**/*', copy);
    gulp.watch('./src/img/**/*.{jpg,jpeg,png}', webp);
    gulp.watch('./src/img/**/*.{jpg,jpeg,png}', avif);
};

export const clear = () => deleteAsync(['dist/**/*'], {forse: true});

// запуск

export const develop = async () => {
    dev = true;
};

export const base = gulp.parallel(html, style, js, img, avif, webp, icons, copy);

export const build = gulp.series(clear, base, critCSS);

export default gulp.series(develop, base, server);
