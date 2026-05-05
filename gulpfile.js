/**
 * Diretórios
 */
const assets = './src/assets/';
const dist = './public/';

/**
 * Dependências
 */
const { task, series, src, watch } = require('gulp');
const clean = require('gulp-clean');
// const del = require('del');
const glob = require('glob');

/**
 * Compila arquivos para produção com a flag --production
 */
const args = require('yargs').argv;

/**
 * Carrega os módulos
 */
glob.sync('./tasks/*.js', {}).forEach(file => {
	require(file)(args, assets, dist);
});

/**
 * Limpa diretórios de produção
 */
task("clean", () => src(dist).pipe(clean()));

/**
 * Copia fontes, jsons, sitemap, imagens e arquivos.
 */
task('copy', series('audios', 'images', 'files'));


/**
 * Roda todas as tasks principais
 */

task('default', series('clean', 'copy' , 'styles', 'scripts', (done) => {
  watch(assets + 'js/**/*.js', series('scripts'));
  watch(assets + 'scss/**/*.scss', series('styles'));

  done();
}));