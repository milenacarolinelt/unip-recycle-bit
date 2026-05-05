const { task, src, dest} = require('gulp')
const gulpIf = require('gulp-if')
const prefixer = require('gulp-autoprefixer')
const sass = require('gulp-sass')(require('sass'))
const notify = require('gulp-notify')
const plumber = require('gulp-plumber')
const merge = require('merge-stream')

const allFiles = [ 
  'general'
];

module.exports = function (args, assets, dist) {
  /**
   * Compila os arquivos SASS
   */
  task('styles', () => {
    const files = allFiles.map((file) => {
      return src(assets + 'scss/unip-aps-' + file + '.scss')
        .pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }))
        .pipe(gulpIf(args.production,
          sass({ outputStyle: 'compressed' }), sass()
        ))
        .pipe(prefixer({
          versions: ['last 3 browsers'],
          remove: false,
        }))
        .pipe(notify({
          title: 'Styles Merged!',
          message: 'Generate file: <%= file.relative %>!'
        }))
        .pipe(dest(dist + 'css/'))
    });

    return merge(files);
  })
}