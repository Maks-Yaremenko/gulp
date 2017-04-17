'use strict'

const gulp = require('gulp');
//const $ = require('gulp-load-plugins')();
const combine = require('stream-combiner2').obj;

const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

module.exports = function (options) {

	return function() {
		return combine(
			gulp.src(options.src),
			this.if(isDevelopment, this.sourcemaps.init()),
			this.debug({title: 'src'}),
			this.stylus(),
			this.if(isDevelopment, this.sourcemaps.write('.')),
			gulp.dest('public')
		).on('error', this.notify.onError());
	};
	
};