'use strict';

const gulp = require('gulp');

gulp.task('hello', function (cb) {
	console.log('hello');
	cb();
});

// или

/*gulp.task('hello');
function hello(callback) {
	console.log('hello');
	callback(); // показать что задача завершена
}*/

gulp.task('example:promise', function () {
	return new Promise((resolve, reject) => {
		//...
		resolve('result');
	});
});

gulp.task('example:stream', function () {
	// reads all from stream (and throws the data away) and then done
	return require('fs').createReadStream(__filename);
});

gulp.task('example:process', function () {
	// returns child process
	return require('child_process').spawn('ls', ['./'], {stdio: 'inherit'});
});

gulp.task('s', gulp.series('hello', 'example:promise', 'example:stream', 'example:process'));
gulp.task('p', gulp.parallel('hello', 'example:promise', 'example:stream', 'example:process'));