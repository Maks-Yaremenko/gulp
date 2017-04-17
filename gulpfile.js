'use strict';

const gulp = require('gulp');
const eslint = require('gulp-eslint');
const through2 = require('through2').obj;
const fs = require('fs'); // используем модуль работы с файловой системой т.к мы работаем не с потоком а с обычным файлом
const gulpIf = require('gulp-if');
const combine = require('stream-combiner2').obj; // для объединенния потоков
const debug = require('gulp-debug');

gulp.task('lint', function () {

	let eslintResults = {};

	let cacheFilePath = process.cwd() + '/tmp/lintCache.json';

	try {
	eslintResults = JSON.parse(fs.readFileSync(cacheFilePath));
	} catch(e) {}
 
	return gulp.src('frontend/**/*.js', {read: false})
		.pipe(debug({title: 'src'}))
		.pipe(gulpIf(
			function (file) {
				return eslintResults[file.path] && eslintResults[file.path].mtime == file.stat.mtime.toJSON(); 
				// если файл не менялся то пишем его слинт рез в кеш
			}, 
			through2(function (file, enc, callback) {
				file.eslint = eslintResults[file.path].eslint;
			}), 
			// read file
			// eslint()
			// eslintResults
			combine(
				through2(function (file, enc, callback) {
					file.contents = fs.readFileSync(file.path);
					callback(null, file);
				}),
				eslint(),
				debug({title: 'eslint'}),
				through2(function (file, enc, callback) {
					eslintResults[file.path] = {
						eslint: file.eslint,
						mtime: file.stat.mtime
					};
					callback(null, file);
				})
			)
		))
		.pipe(eslint.format()) // если хотим вывести на экран
		.on('end', function () {
			fs.writeFileSync(cacheFilePath, JSON.stringify(eslintResults));
			this.end();
		})


//		.pipe(eslint()) // .eslintrc проверяет и сохраняет в file.eslint
//		.pipe(through2(
//			function (file, enc, callback) {
//				eslintResults[file.path] = {
//					eslint: file.eslint,
//					mtime: file.stat.mtime
//				};
//				callback(null, file);
//			},
//			function (callback) {
//				fs.writeFileSync(cacheFilePath, JSON.stringify(eslintResults));
//				callback();
//			}
//		))
//		.pipe(eslint.format()) // если хотим вывести на экран
//		.pipe(eslint.failAfterError()) // тоже проверяет свойства eslint
});