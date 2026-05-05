var gulp     = require('gulp')
var gulpIf   = require('gulp-if')
var imageMin = require('gulp-imagemin')

module.exports = (args, assets, dist) => {
  /**
   * Copia/minifica imagens
   */
  gulp.task('images', () => {
    return gulp.src( assets + 'images/**/*')
      .pipe(gulpIf(args.production, imageMin()))
      .pipe(gulp.dest(dist + 'images'))
  });

  /**
   * Copia fontes
   */
  gulp.task('audios', () => {
    return gulp.src(assets + 'audios/*')
      .pipe(gulp.dest(dist + 'audios'))
  });
  
  /**
   * Copia arquivos
   */
  gulp.task('files', () => {
    return gulp.src(assets + 'files/*')
      .pipe(gulp.dest(dist + 'files'))
  });
}