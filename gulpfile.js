'use strict';

const gulp = require('gulp');

gulp.task('default', function () {
	//return gulp.src('source/**/*.*')
	//return gulp.src('source/**/*.{js,css}')
	//return gulp.src('{source1, source2}/**/*.{js,css}')
	//return gulp.src(['source1/**/*.js', 'source2/**/*.css')
	return gulp.src(['**/**/*.*', '!node_modules/**') // игнорирование
			.on('data', function (file) {
				console.log({
					contents: file.contents,
					path: 	  file.path,
					cwd: 	  file.cwd,
					base: 	  file.base,
					// path component helpers
					relative: file.relative,
					dirname:  file.dirname,  // .../source/1
					basename: file.basename, // 1.js
					stem:     file.steam,    // 1
					extname:  file.extname   // .js
				});
			})
			//.pipe(gulp.dest('assets'));

			.pipe(gulp.dest(function (file) {
				return file.extname == '.js' ? 'js' :
					   file.extname == '.css' ? 'css' : 'assets';
			}))
});