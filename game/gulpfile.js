const gulp = require('gulp');
const pug = require('gulp-pug');

// run this task by typing in gulp pug in CLI
gulp.task('pug', function() {
    return gulp.src('views/pages/game/index.pug')
        .pipe(pug()) // pipe to pug plugin
        .pipe(gulp.dest('public')); // tell gulp our output folder
});
