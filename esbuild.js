const esbuild = require('esbuild')
const { sassPlugin } = require('esbuild-sass-plugin')

const esbuildConfig = {
  entryPoints: [
    'app/javascript/application.js',
    'app/javascript/official.js',
    'app/javascript/results.js',
    'app/javascript/referee.js',
    'app/javascript/admin.js',
  ],
  bundle: true,
  loader: { '.jpg': 'dataurl', '.js': 'jsx' },
  jsx: 'automatic',
  sourcemap: true,
  outdir: 'app/assets/builds',
  plugins: [sassPlugin()],
}

esbuild.build(esbuildConfig).catch(() => process.exit(1))

module.exports = { esbuildConfig }
