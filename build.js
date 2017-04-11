const fs = require('fs')
const sass = require('node-sass')
const nodeSassGlobbing = require('node-sass-globbing')
const browserify = require('browserify')
const postcss = require('postcss')
const autoprefixer = require('autoprefixer')

let args = process.argv.slice(2)
let buildjs = args.length === 0 || args.indexOf('js') > -1
let buildcss = args.length === 0 || args.indexOf('css') > -1

if (buildcss) {
  console.log('Building CSS')

  sass.render({
    file: './admin/sass/main.sass',
    importer: nodeSassGlobbing,
    includePaths: [
      './node_modules/support-for/sass',
      './node_modules/normalize-scss/sass',
      './node_modules/font-awesome/scss'
    ]
  }, (err, result) => {
    if (err) {
      return console.error('Error compiling sass', err)
    }

    postcss([autoprefixer])
      .process(result.css, { from: './admin/admin.css', to: './admin/admin.css' })
      .then(result => {
        fs.writeFile('./admin/admin.css', result.css, err =>
          err ? console.log('Error saving admin.css') : null)
        if (result.map) {
          fs.writeFile('./admin/admin.css.map', result.map, err =>
          err ? console.log('Error saving admin.css.map') : null)
        }
      })
  })
}

if (buildjs) {
  console.log('Building JavaScript')

  browserify('./admin/js/app.js')
    .transform('babelify', {
      presets: ['es2015', 'stage-0'],
      plugins: [
        ['transform-react-jsx', { 'pragma': 'preact.h' }],
        ['babel-plugin-jsx-pragmatic', {
          module: 'preact',
          import: 'preact'
        }]
      ]
    })
    .bundle()
    .pipe(fs.createWriteStream('./admin/admin.js'))
}
