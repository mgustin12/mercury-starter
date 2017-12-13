var path = require('path');
var gulp = require('gulp');
var less = require('gulp-less');
var concat = require('gulp-concat');
var eslint = require('gulp-eslint');
var uglify = require('gulp-uglify');
var bust = require('gulp-buster');
var rename = require('gulp-rename');
var mustache = require('gulp-mustache');
var browserify = require('browserify');
var envify = require('envify');
var source = require('vinyl-source-stream');
var babelify = require('babelify');

require('dotenv').config();

function mustachify() {
	var bustJS = require('./bust-js.json');
	var bustCSS = require('./bust-css.json');
	var css = '/css/application.' + bustCSS['public/css/application.css'] + '.css';
	var js = '/js/application.' + bustJS['public/js/application.js'] + '.js';
	return gulp.src('index.mustache')
		.pipe(mustache({
			css: css,
			js: js
		}, { extension: '.html' }))
		.pipe(gulp.dest('public'));
}

function renamifyJS() {
	var busters = require('./bust-js.json');
	return gulp.src('public/js/*.js')
		.pipe(rename('application.' + busters['public/js/application.js'] + '.js'))
		.pipe(gulp.dest('public/js'));
}

function renamifyCSS() {
	var busters = require('./bust-css.json');
	return gulp.src('public/css/*.css')
		.pipe(rename('application.' + busters['public/css/application.css'] + '.css'))
		.pipe(gulp.dest('public/css'));
}

function bustifyJS() {
	return gulp.src('public/js/application.js')
		.pipe(bust('bust-js.json'))
		.pipe(gulp.dest('.'));
}

function bustifyCSS() {
	return gulp.src('public/css/application.css')
		.pipe(bust('bust-css.json'))
		.pipe(gulp.dest('.'));
}

function lessify() {
	return gulp.src('src/modules/**/*.less')
		.pipe(less({
			paths: [
				path.join(__dirname, './node_modules')
			]
		}))
		.pipe(concat('application.css'))
		.pipe(gulp.dest('public/css'));
}

function htmlify() {
	var css = '/css/application.css';
	var js = '/js/application.js';
	return gulp.src('index.mustache')
		.pipe(mustache({
			css: css,
			js: js
		}, { extension: '.html' }))
		.pipe(gulp.dest('public'));
}

function jsify() {
	return browserify('src/index.js')
		.transform(babelify)
		.transform(envify)
		.bundle()
		.pipe(source('application.js'))
		.pipe(gulp.dest('public/js'));
}

function lintify() {
	return gulp.src(['gulpfile.js', 'src/**/*.js', 'src/**/*.jsx'])
		.pipe(eslint())
		.pipe(eslint.format());
}

function minifyify() {
	return gulp.src('public/js/*.js')
		.pipe(uglify())
		.pipe(gulp.dest('public/js'));
}

gulp.task('lint', lintify);
gulp.task('html', htmlify);
gulp.task('css', lessify);
gulp.task('js', jsify);
gulp.task('css-production', lessify);
gulp.task('bustify-css', ['css-production'], bustifyCSS);
gulp.task('renamify-css', ['bustify-css'], renamifyCSS);
gulp.task('js-production', ['renamify-css'], jsify);
gulp.task('bustify-js', ['js-production'], bustifyJS);
gulp.task('renamify-js', ['bustify-js'], renamifyJS);
gulp.task('minify', ['renamify-js'], minifyify);
gulp.task('mustachify', ['minify'], mustachify);
gulp.task('default', ['css', 'html', 'lint', 'js']);

gulp.task('watch', function(){
	gulp.watch('src/modules/**/*.less', ['css']);
	gulp.watch('src/**/*.jsx', ['lint', 'js']);
	gulp.watch('src/**/*.js', ['lint', 'js']);
	gulp.watch('index.mustache', ['html']);
});

gulp.task('build', [
	'css-production',
	'bustify-css',
	'renamify-css',
	'js-production',
	'bustify-js',
	'renamify-js',
	'minify',
	'mustachify'
]);