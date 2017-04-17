'use strict';

const fs = require('fs');
const gulp = require('gulp');
//const $ = require('gulp-load-plugins')();
const through2 = require('through2').obj;
const combine = require('stream-combiner2').obj;

module.exports = function (options) {

	return function () {
		let eslintResults = {};

		let cacheFilePath = process.cwd() + options.cacheFilePath;

		try {
			eslintResults = JSON.parse(fs.readFileSync(cacheFilePath));
		} catch(e) {}
	 
		return gulp.src(options.src, {read: false})
			.pipe(this.debug({title: 'src'}))
			.pipe(this.if(
				function (file) {
					return eslintResults[file.path] && eslintResults[file.path].mtime == file.stat.mtime.toJSON(); 
					// если файл не менялся то пишем его слинт рез в кеш
				}, 
				through2(function (file, enc, callback) {
					file.eslint = eslintResults[file.path].eslint;
					callback(null, file);
				}), 
				combine(
					through2(function (file, enc, callback) {
						file.contents = fs.readFileSync(file.path);
						callback(null, file);
					}),
					this.eslint(),
					this.debug({title: 'eslint'}),
					through2(function (file, enc, callback) {
						eslintResults[file.path] = {
							eslint: file.eslint,
							mtime: file.stat.mtime
						};
						callback(null, file);
					})
				)
			))
			.pipe(this.eslint.format()) // если хотим вывести на в консоль ошибки развернуто
			.on('end', function () {
				fs.writeFileSync(cacheFilePath, JSON.stringify(eslintResults));
			})
			.pipe(this.eslint.failAfterError());
	}
	
};