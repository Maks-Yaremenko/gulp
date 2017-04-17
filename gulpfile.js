'use strict';

const gulp = require('gulp');
var task = require('gulp-lazy-task')('./tasks');
// c использованием пака можно не использовать модуль gulp-load-plugins, работа похожа аналогична, 
// только вместо $ ставим this внутри экспортируемых функций чтоб получить доступ к модулю.

function lazyTask(taskName, path, options) {
	options = options || {};
	options.taskName = taskName;
	gulp.task(taskName, function (callback) {
		let task = require(path).call(this, options);

		return task(callback);
	});
}
// лучше использовать gulp-lazy-task разница в скорости почти в 2 раза

task('styles', './tasks/styles', {
	src: 'frontend/styles/**/main.styl'
});

task('assets', './tasks/assets', {
	src: 'frontend/assets/**',
	dst: 'public'
});

task('clean', './tasks/clean', {
	dst: 'public'
});

task('serve', './tasks/serve' ,{
	server: 'public',
	src: 'public/**/*.*'
});

task('lint', './tasks/lint', {
	cacheFilePath : '/tmp/lintCache.json',
	src: 'frontend/**/*.js'
});

gulp.task('build', gulp.series( 'clean', gulp.parallel('styles', 'assets')));

gulp.task('watch', function () {
	gulp.watch('frontend/styles/**/*.*', gulp.series('styles')); // нужно указывать или серию или параллель
	gulp.watch('frontend/assets/**/*.*', gulp.series('assets')); 
});

gulp.task('dev', 
	gulp.series('build', gulp.parallel('watch', 'serve'))
	// делаем паралель т.к вотч и серв никогда не завершается
);