const { task, dest } = require('gulp')
const gulpIf = require('gulp-if')
const uglify = require('gulp-uglify-es').default
const notify = require('gulp-notify')
const plumber = require('gulp-plumber')
const connect = require('gulp-connect')
const merge = require('merge-stream')
const browserify = require('browserify')
const babelify = require('babelify')
const source = require('vinyl-source-stream')
const buffer = require('vinyl-buffer')

const allFiles = [ 
  'general'
];

module.exports = function (args, assets, dist) {
  /**
   * Concatena e minifica arquivos JS
   */
  task('scripts', () => {
    const files = allFiles.map((file) => {
      return browserify(assets + 'js/unip-aps-' + file + '.js')
        .transform(babelify.configure({
          presets: ['es2015']
        })).bundle()
        .pipe(source('unip-aps-' + file + '.js'))
        .pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }))
        .pipe(gulpIf(args.production, buffer()))
        .pipe(gulpIf(args.production, uglify()))
        .pipe(notify({
          title: 'Scripts Merged!',
          message: 'Generate file: <%= file.relative %>!'
        }))
        .pipe(dest(dist + 'js/'))
        .pipe(connect.reload())
    });

    return merge(files);
  })
}