// vi gulpfile.js

// 引入 gulp
var gulp = require('gulp');

// 引入组件
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var less = require('gulp-less');
var minifyCss = require('gulp-minify-css');

// 检查脚本
gulp.task('lint', function() {
    gulp.src('./js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// 处理用户的 less
gulp.task('less', function() {
    gulp.src('./less/*.less')
        .pipe(less())
        .pipe(concat('sites.css'))
        .pipe(gulp.dest('./dist/css'))
        .pipe(minifyCss({
            compatibility: 'ie8'
        }))
        .pipe(rename('sites.min.css'))
        .pipe(gulp.dest('./dist/css'));
});

// 处理用户的 js
gulp.task('js', function() {
    gulp.src('./js/*.js')
        .pipe(concat('sites.js'))
        .pipe(gulp.dest('./dist/js'))
        .pipe(rename('sites.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js'));
});

// 合并 vendor css
gulp.task('vendorCss', function() {
    gulp.src(['./bower_components/bootstrap/dist/css/bootstrap.css',
            './bower_components/bootstrap/dist/css/bootstrap-theme.css'
        ])
        .pipe(concat('vendor.css'))
        .pipe(replace('/*!', '/*'))
        .pipe(gulp.dest('./dist/css'))
        .pipe(minifyCss({
            compatibility: 'ie8'
        }))
        .pipe(rename('vendor.min.css'))
        .pipe(gulp.dest('./dist/css'));
});

// 合并 vendor js
gulp.task('VendorJs', function() {
    gulp.src(['./bower_components/jquery/dist/jquery.js',
            './bower_components/bootstrap/dist/js/bootstrap.js'
        ])
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest('./dist/js'))
        .pipe(rename('vendor.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js'));
});

// 默认任务
gulp.task('default', function() {
    gulp.run('lint', 'less', 'js', 'vendorCss', 'VendorJs');

    // 监听文件变化
    gulp.watch('./js/*.js', function() {
        gulp.run('lint', 'js');
    });
    gulp.watch('./bower_components/*', function() {
        gulp.run('VendorJs', 'VendorCss');
    });
    gulp.watch('./less/*.less', function() {
        gulp.run('less');
    });
});
