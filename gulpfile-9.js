'use strict';

const gulp = require('gulp');
const through2 = require('through2').obj;
const File = require('vinyl');

// Плагин для версионирования gulp-rev 
// https://www.npmjs.com/package/gulp-rev

//gulp.task('assets', function () {
//	return gulp.src('frontend/assets/**/*.*')
//		.pipe(through2(function(file, enc, callback){

//			let file2 = file.clone();
//			file2.path += '.bak';
//			this.push(file2);

//			console.log(file);
			//...
			//callback(null);
			//callback(new Error('...'));
			// если не хотим передавать его дальше - вызываем просто callback();
			// если хотим передать ошибку - первым аргументом, если файл - вторым
			// если много файлов this.push()
//			callback(null, file);

//		}))
//		.pipe(gulp.dest('public'));
//});

gulp.task('assets', function () {

	const mtimes = {};

	return gulp.src('frontend/assets/**/*.*')
		.pipe(through2(
			function (file, enc, callback) {
				mtimes[file.relative] = file.stat.mtime
				callback(null, file);
			},
			function (callback) {
				// сработает оn-end
				let manifest = new File({
					//cwd base path contents
					contents: new Buffer(JSON.stringify(mtimes)),
					base: process.cwd(),
					path: process.cwd() + '/manifest.json'
				});
				manifest .isManifest = true;
				this.push(manifest);
				callback();
			}
		))
		//.pipe(gulp.dest('public'))
		.pipe(gulp.dest(function (file) {  // если мы хотим по особому отсортировать файлики юзаем функу
			if (file.isManifest) { return process.cwd(); }
			return 'public';
		}))
})

// вариант 2 с использованием потока а не с проверкой : 

gulp.task('assets', function () {

	const mtimes = {};

	return gulp.src('frontend/assets/**/*.*')
		.pipe(through2(
			function (file, enc, callback) {
				mtimes[file.relative] = file.stat.mtime
				callback(null, file);
			}
		))
		.pipe(gulp.dest('public'))
		.pipe(through2(
			function (file, enc, callback) {
				callback();  // игнорируем файлы
			},
			function (callback) {
				// сработает оn-end
				let manifest = new File({
					//cwd base path contents
					contents: new Buffer(JSON.stringify(mtimes)),
					base: process.cwd(),
					path: process.cwd() + '/manifest.json'
				});
				manifest .isManifest = true;
				this.push(manifest);
				callback();
			}
		))
		.pipe(gulp.dest('.'));
		
})