const gulp = require('gulp');
const bs = require('browser-sync').create();

gulp.task('default', ()=>{
	console.log('testing Biache!');
	gulp.watch('index.html').on('change', bs.reload);
	gulp.watch('main.js', ['scripts']);
	bs.init({
	    server: "./"
	});
});

gulp.task('scripts', ()=>{
	gulp.src("./main.js")
	.pipe(bs.stream());

})