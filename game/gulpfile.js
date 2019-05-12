const gulp = require('gulp');
const pug = require('gulp-pug');
const data = require('gulp-data');
const fs = require('fs');
const textFile = require('./public/game/assets/text/textTemplate.js');

// run this task by typing in gulp pug in CLI
gulp.task('pug', function() {
    return gulp.src('views/pages/game/index.pug')
        .pipe(data(function(file) {
            return textFile;
        }))
        .pipe(pug()) // pipe to pug plugin
        .pipe(gulp.dest('public/game')); // tell gulp our output folder
});
