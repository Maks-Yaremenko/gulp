'use strict';

const gulp = require('gulp');
const stylus = require('gulp-stylus'); // для конвертации стилус в ксс
const concat = require('gulp-concat'); // для объединения файлов в 1
const debug = require('gulp-debug'); // пропускает все через себя и выводит что происходит
const sourcemaps = require('gulp-sourcemaps'); // отображает что было и что стало
const gulpIf = require('gulp-if'); // позволяет в зависимости от условия пропускать или запускать поток
const del = require('del'); // для удаления директорий

const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

// не забывать возвращать результат или колбак

gulp.task('styles', function (callback) {

	console.log(require('stylus/lib/parser').cache);

	//return gulp.src('frontend/**/*.styl')
	//return gulp.src('frontend/styles/**/main.styl', {base: 'frontend'})
	return gulp.src('frontend/styles/**/main.styl')
		.pipe(gulpIf(isDevelopment, sourcemaps.init()))  // file.sourceMap
		//.pipe(debug({title: 'src'}))
		.pipe(stylus()) // кеширует результат после первого запуска
		//.pipe(debug({title: 'stylus'}))
		//.pipe(concat('app.css'))
		//.pipe(debug({title: 'concat'}))
		.pipe(gulpIf(isDevelopment, sourcemaps.write('.')))
		.pipe(gulp.dest('public'))

});

gulp.task('clean', function () {
	return del('public'); // возвр промис и гал понимает что задача завершена
});

gulp.task('assets', function () {
	return gulp.src('frontend/assets/**', {since: gulp.lastRun('assets')}) // будет проверять файлы которые
																  // были изменены после последнего запуска
			.pipe(debug({title: 'assets'}))
			.pipe(gulp.dest('public'));
})

gulp.task('build', gulp.series(
		'clean', 
		gulp.parallel('styles', 'assets')));

gulp.task('watch', function () {
	gulp.watch('frontend/styles/**/*.*', gulp.series('styles')); // нужно указывать или серию или параллель
	gulp.watch('frontend/assets/**/*.*', gulp.series('assets')); 
});

gulp.task('dev', gulp.series('build', 'watch'));


