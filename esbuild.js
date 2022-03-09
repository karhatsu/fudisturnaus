const esbuild = require('esbuild')
const { sassPlugin } = require('esbuild-sass-plugin')

esbuild.build({
  entryPoints: ['app/javascript/application.js', 'app/javascript/official.js', 'app/javascript/admin.js'],
  bundle: true,
  loader: { '.jpg': 'dataurl', '.js': 'jsx' },
  sourcemap: true,
  outdir: 'app/assets/builds',
  plugins: [sassPlugin()],
  watch: process.argv.includes('--watch'),
}).catch(() => process.exit(1))
