const gulp = require('gulp')
const server = require('gulp-express')
const mocha = require('gulp-mocha')
const gutil = require('gulp-util')

const nodemon = require('gulp-nodemon')
const jshint = require('gulp-jshint')
const browserSync = require('browser-sync')
//该 reload 方法会通知所有的浏览器相关文件被改动，要么导致浏览器刷新，要么注入文件，实时更新改动。
// 浏览器重载
//bs.reload();

// 单个文件
//bs.reload("styles.css");

// 多个文件
//bs.reload(["styles.css", "ie.css"]);

// 在2.6.0里 - 通配符来重新加载所有的CSS文件 
//bs.reload("*.css");
const reload = browserSync.reload()

// 运行所有测试用例
/*
gulp.task('default', function() {
	return gulp.src(['test/!**!/!*.js'], {read: false})
			   .pipe(mocha({
			   		reporter: 'spec',
			   		globals: {
			   			should: require('should')
			   		}
			   }))
})
*/
/*
	gulp.task(name[,deps],fn)
	name: 任务名称
	deps: 任务的依赖任务，可选参数
	fn: 任务的回调函数
*/

gulp.task('browser-sync', ['nodemon'], function() {
	browserSync.init(null, {
		proxy: 'http://localhost:3000',
		files: ['**'],
		browser: 'chrome',
		notify: false,//浏览器消息助手
		port: 3000
	})
})

gulp.task('js', function() {
	return gulp.src(['app.js','public/js/*.js','app/**/*.js','config/routes.js'])
			   .pipe(jshint())
			   .pipe(jshint.reporter('default'))// 对代码进行报错提示
})

gulp.task('nodemon', function(cb) {
	let called = false
	return nodemon({
		script: 'app.js'
	}).on('start', function() {
		if (!called) {
			cb();
			called = true
		}
	})
})

gulp.task('clean', function(cb) {
	del(['./dist'], cb)
})

gulp.task('server', function() {
	server.run(['app.js'])

	// restart the server when app.js changes
    /* 
    	gulp.watch(globs, fn) 
    		globs: 文件路径, 
    		*: 任意字符,除目录符'/'和拓展名.js .css .html等。允许：.js a.js abc.js
    		**: 任意字符,可以包括目录符号,但不包括拓展名.js .css等。允许： /a.js

    */
	gulp.watch(['app.js', 'public/js/*.js', 'app/**/*.js', 'config/routes.js'], server.run)
	gulp.watch(['app/views/**'], server.notify) // **/*.jade
})


gulp.task('dist', ['js'])
gulp.task('default', ['browser-sync'])
gulp.task('default', ['server'])


// gulp.src(filePath, option)方法：将文件转换成stream流；
/*
// 文件改动时运行mocha测试用例
gulp.task('mocha', function() {
	return gulp.src(['test/!*.js'], {read: false})
			   .pipe(mocha({reporter: 'list'}))
			   .on('error', gutil.log)
})

gulp.task('watch-mocha', function() {
	gulp.watch(['lib/!**', 'test/!**'], ['mocha'])
})
*/
