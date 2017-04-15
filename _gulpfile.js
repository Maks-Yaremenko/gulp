'use strict';

const gulp = require('gulp');
const concat = require('gulp-concat'); // для объединения файлов в 1
const debug = require('gulp-debug'); // пропускает все через себя и выводит что происходит
const autoprefixer = require('gulp-autoprefixer');
const remember = require('gulp-remember'); // добавляет файлы если они были пропущены при контроле версий
const path = require('path');
const cached = require('cached');

gulp.task('styles', function (callback) {

	//return gulp.src('frontend/**/*.css', {since: gulp.lastRun('styles')})
	return gulp.src('frontend/**/*.css', {since: gulp.lastRun('styles')})
		.pipe(cached('styles')) // смотрит на содержимое файла а не на дату модификации как since
								// since работает быстрее т.к смотрит дату, а не читает файл
		.pipe(autoprefixer())
		.pipe(remember('styles')) // запоминает файлы которые через него прошли
		.pipe(concat('all.css'))
		.pipe(gulp.dest('public'))

});

gulp.task('watch', function () {
	gulp.watch('frontend/styles/**/*.css', gulp.series('styles')).on('unlink', function (filepath) {
		remember.forget('styles', path.resolve(filepath)); // чтоб забыть удаленные файлы
		delete cached.caches.styles[path.resolve(filepath)]
	})
});

gulp.task('dev', gulp.series('styles', 'watch'));


