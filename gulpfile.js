var gulp = require('gulp');	
var less = require('gulp-less');
var autoprefixer = require('gulp-autoprefixer')
var concat = require('gulp-concat');
var gulpFilter = require('gulp-filter');
var imagemin = require('gulp-imagemin');
var uglify = require('gulp-uglify');
var minify = ('gulp-minify-css');
var spritesmith = require('gulp.spritesmith');
var plumber = require('gulp-plumber');
var path = require('path');
var gutil = require('gulp-util');


var onError = function (err) {  
  gutil.beep();
  console.log(err.toString());
  this.emit('end');
};


// проходим по файлам, импортируемым в less/imports.less и конвертируем их в css
gulp.task('less', function () {
    return gulp.src('src/less/imports.less')
        .pipe(plumber({ errorHandler: onError }))
        .pipe(less({
            paths: [ path.join(__dirname, 'less', 'includes') ]
        }))
        .pipe(gulp.dest('src/css/'))
});


// соединяем css файлы в один main.css
gulp.task('concat-css', ['less'], function() {
    return gulp.src(['src/css/*.css'])
        .pipe(plumber({ errorHandler: onError }))
        .pipe(concat({ path: 'main.css', stat: { mode: 0666 }}))
        .pipe(gulp.dest('src/css'));
});


// расставляем вендорные префиксы
gulp.task('autoprefixer', ['concat-css'], function () {
	return gulp.src('src/css/main.css')
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}))
		.pipe(gulp.dest('build/css'));
});


// задача по умолчанию
gulp.task('default', function() {
    gulp.watch('src/less/*.less', ['less', 'concat-css', 'autoprefixer']);  
    // gulp.watch('src/img/**/*', ['imagemin']);
});