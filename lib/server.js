const express = require('express')
const path = require('path')
const fs = require('fs')
const chokidar = require('chokidar')
const colors = require('colors/safe')
const admin = require('./admin')
const compile = require('./compile')

let errorHandler = res => err => {
  if (err) { res.sendStatus(err.status || 404) }
}

let serve = directory => (req, res) => {
  let slug = req.path.substr(1)
  let slugs = compile.getSlugs()
  let options = { root: directory }

  if (slug === '' && compile.getHomeFile()) {
    return res.sendFile(compile.getHomeFile(), options, errorHandler(res))
  }

  if (slugs[slug]) {
    return res.sendFile(slugs[slug], options, errorHandler(res))
  }

  if (fs.existsSync(path.join(directory, req.path))) {
    return res.sendFile(req.path, options, errorHandler(res))
  }

  // Not found
  if (slugs['404']) {
    return res.status(404).sendFile(slugs['404'], options, errorHandler(res))
  } else if (slugs['error']) {
    return res.status(404).sendFile(slugs['error'], options, errorHandler(res))
  }

  res.sendStatus(404)
}

let watchFiles = ({ directory, websitename, uploads }) => {
  let options = {
    awaitWriteFinish: true,
    ignoreInitial: true
  }
  let local = { websitename, uploads }

  chokidar.watch('.', Object.assign({
    ignored: [
      /[/\\]\./,
      '.junglecompiled'
    ]
  }, options))
    .on('all', (event, file) => {
      let shouldRecompile = ['.html', '.pug']
        .indexOf(path.extname(file)) > -1 ||
        file.lastIndexOf('.junglet.html') > -1

      if (shouldRecompile) {
        console.log(`${file} changed`)
        compile.compile(directory, local)
      }
    })

  chokidar.watch('.jungleconfig', options)
    .on('all', (event, file) => {
      console.log(`${file} changed`)
      compile.compile(directory, local)
    })

  chokidar.watch('.jungledb', options)
    .on('unlink', file => {
      console.log(`${file} removed`)
      compile.compile(directory, local)
    })
}

module.exports = (options) => {
  let { port, directory, adminurl, name, uploads, secret } = options
  let app = express()

  compile.compile(directory, { websitename: name, uploads })

  let adminApp = express.Router()

  adminApp.use('/api', admin.api({ directory, websitename: name, uploads, secret, adminurl }))
  adminApp.use('/fonts', express.static(path.join(__dirname, '../node_modules/font-awesome/fonts')))
  adminApp.use('/static', express.static(path.join(__dirname, '../admin/static')))
  adminApp.get('/admin.css', admin.css)
  adminApp.get('/admin.js', admin.js)
  adminApp.get('/manifest.json', admin.manifest({ adminurl }))
  adminApp.get('*', admin.page({ directory, adminurl, websitename: name, uploads }))

  app.disable('x-powered-by')
  app.use(adminurl, adminApp)
  app.get('*', serve(directory))

  app.listen(port, () => console.log(`Running jungledrum on port ${colors.green(port)}\n`))
    .on('error', err => {
      if (['EACCES', 'EADDRINUSE'].indexOf(err.code) > -1) {
        console.log(`Port ${colors.green(port)} is already in use. Unable to start jungledrum`)
        process.exit()
      }
    })

  watchFiles({ directory, websitename: name, uploads })
}
