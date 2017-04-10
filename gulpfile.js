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

	//return gulp.src('frontend/**/*.styl')
	//return gulp.src('frontend/styles/**/main.styl', {base: 'frontend'})
	return gulp.src('frontend/styles/**/main.styl')
		.pipe(gulpIf(isDevelopment, sourcemaps.init()))  // file.sourceMap
		//.pipe(debug({title: 'src'}))
		.pipe(stylus())
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
	return gulp.src('frontend/assets/**')
			.pipe(gulp.dest('public'));
})

gulp.task('build', gulp.series(
		'clean', 
		gulp.parallel('styles', 'assets')));