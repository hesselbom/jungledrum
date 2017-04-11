const express = require('express')
const path = require('path')
const pug = require('pug')
const bodyParser = require('body-parser')
const shortid = require('shortid')
const slug = require('slug')
const db = require('./db')
const {toTitleCase, hashPassword} = require('./helpers')
const compile = require('./compile')
const multer = require('multer')
const mkdirp = require('mkdirp')
const fs = require('fs')
const jwt = require('jsonwebtoken')
const expressjwt = require('express-jwt')

const sortOnTitle = (a, b) => a._title === b._title ? 0 : a._title < b._title ? -1 : 1
const sortOnName = (a, b) => a.name === b.name ? 0 : a.name < b.name ? -1 : 1

const mapPages = (home, isStatic) => page =>
  Object.assign(
    {},
    page,
    {
      '_static': isStatic,
      '_home': home === page._slug || (!home && page._slug === 'index')
    }
  )

const mapTemplateFields = field =>
  Object.assign(
    {},
    field,
    { 'name': field.name || toTitleCase(field.id.replace(/_/g, ' ')) }
  )

const generateSlug = (title, pages) => {
  let _slug = slug(title, { lower: true })
  let unique = (base, count) => {
    let s = count > 1 ? `${base}-${count}` : base
    if (pages.find(p => p._slug === s)) {
      return unique(base, count + 1)
    }
    return s
  }
  return unique(_slug, 1)
}

const dataToPage = (data, _db) =>
  Object.assign(
    {},
    data,
    {
      _id: data._id || shortid.generate(),
      _title: data._title || 'Page',
      _template: data._template || Object.keys(_db.templates || {})[0],
      _slug: data._slug || generateSlug(data._title || 'Page', _db.pages || [])
    }
  )

const requiresLogin = directory => {
  let _db = db.read(directory)
  return _db.users && _db.users.length > 0
}

const getPlugins = directory => {
  try {
    return fs.readdirSync(path.join(directory, 'plugins'))
      .filter(file => path.extname(file) === '.js')
  } catch (err) { return [] }
}

module.exports = {
  page: options => (req, res) => {
    let plugins = getPlugins(options.directory)

    res.send(pug.renderFile(path.join(__dirname, '../admin/index.pug'), Object.assign({
      plugins,
      requiresLogin: requiresLogin(options.directory)
    }, options)))
  },
  css: (req, res) => {
    res.sendFile(path.join(__dirname, '../admin/admin.css'))
  },
  js: (req, res) => {
    res.sendFile(path.join(__dirname, '../admin/admin.js'))
  },
  api: ({ directory, websitename, uploads, salt, adminurl }) => {
    let storage = multer.diskStorage({
      destination: function (req, file, cb) {
        let dest = path.join(directory, uploads)
        mkdirp(dest, function (err) {
          if (err) console.error(err)
          else cb(null, dest)
        })
      },
      filename: function (req, file, cb) {
        // TODO: Only rename if already exists
        let ext = path.extname(file.originalname)
        let filename = slug(path.basename(file.originalname, ext), { lower: true }) + ext
        cb(null, `${Date.now()}__${filename}`)
      }
    })
    let upload = multer({ storage: storage })

    let app = express.Router()
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true }))

    let auth = expressjwt({secret: salt + salt}).unless({path: [`${adminurl}/api/login`]})
    app.use((req, res, next) =>
      // TODO: Optimize to not check this for every call
      requiresLogin(directory)
        ? auth(req, res, next)
        : next()
    )
    app.use(function (err, req, res, next) {
      if (err.name === 'UnauthorizedError') {
        res.status(401).json({ error: 'invalid_token' })
      }
    })

    app.post('/login', (req, res) => {
      let _db = db.read(directory)
      let {username, password} = req.body

      if (username && password) {
        password = hashPassword(password, salt)
        let user = _db.users.find(user => user.username === username && user.password === password)
        if (user) {
          let token = jwt.sign({ username }, salt + salt, { expiresIn: '30 days' })
          return res.json({ token, username })
        }
      }
      res.sendStatus(401)
    })

    app.get('/me', (req, res) => {
      res.json({ username: req.user.username })
    })

    app.get('/pages', (req, res) => {
      let _db = db.read(directory)

      res.json([].concat(
        (_db.pages || []).map(mapPages(_db.home, false)),
        (_db.static_pages || []).map(mapPages(_db.home, true))
      ).sort(sortOnTitle))
    })

    app.get('/templates', (req, res) => {
      let templates = db.read(directory).templates || {}
      Object.keys(templates).forEach(key => {
        let t = templates[key]
        t.fields = t.fields.map(mapTemplateFields)
      })
      res.json(templates)
    })

    app.get('/files', (req, res) => {
      let _db = db.read(directory)
      res.json((_db.files || []).sort(sortOnName))
    })

    app.post('/file', upload.single('file'), (req, res) => {
      let _db = db.read(directory)
      let file = {
        name: req.file.filename,
        uploaded: Date.now()
      }

      _db.files = (_db.files || []).concat(file)
      db.write(directory, _db)
      res.json(file)
    })

    app.post('/pages', (req, res) => {
      let _db = db.read(directory)
      let data = req.body
      let setAsHome = false

      delete data._id
      if (data._home && data._home !== 'false') {
        setAsHome = true
        delete data._home
      }

      let page = dataToPage(data, _db)
      _db.pages = (_db.pages || []).concat(page)

      if (setAsHome) _db.home = page._slug

      db.write(directory, _db)
      res.json({ _id: page._id })
      compile.compile(directory, { websitename, uploads })
    })

    app.put('/pages/static/:pageid', (req, res) => {
      if (req.body._home && req.body._home !== 'false') {
        let _db = db.read(directory)
        let page = (_db.static_pages || []).find(p => p._id === req.params.pageid)

        if (page) {
          _db.home = page._slug
          db.write(directory, _db)
          compile.compile(directory, { websitename, uploads })
        }
      }
      res.sendStatus(200)
    })

    app.put('/pages/:pageid', (req, res) => {
      let _db = db.read(directory)
      let data = req.body
      let page = (_db.pages || []).find(p => p._id === req.params.pageid)
      let setAsHome = false
      data._id = req.params.pageid

      if (!page) return res.sendStatus(404)

      if (data._home && data._home !== 'false') {
        setAsHome = true
        delete data._home
      }

      Object.assign(page, dataToPage(data, _db))

      if (setAsHome) _db.home = page._slug

      db.write(directory, _db)
      res.sendStatus(200)
      compile.compile(directory, { websitename, uploads })
    })

    // TODO: Test if this works
    app.delete('/pages/:pageid', (req, res) => {
      let _db = db.read(directory)
      let index = -1
      let page = (_db.pages || []).find((p, i) => {
        let matches = p._id === req.params.pageid
        if (matches) index = i
        return matches
      })

      if (!page) return res.sendStatus(404)

      // TODO: Test if this works
      if (page._slug === _db.home) {
        _db.home = ''
      }

      _db.pages.splice(index, 1)

      db.write(directory, _db)
      res.sendStatus(200)
      compile.compile(directory, { websitename, uploads })
    })

    return app
  }
}
