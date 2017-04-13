const path = require('path')
const fs = require('fs-extra')
const glob = require('glob')
const perfy = require('perfy')
const colors = require('colors/safe')
const pug = require('./templates/pug')
const junglet = require('./templates/junglet')
const db = require('./db')
const markdown = require('./formatters/markdown')

let slugs = {}
let homeFile = ''

const getFileSlug = filename => path.parse(filename).name
const getHtmlTitle = file => {
  let html = fs.readFileSync(file, 'utf8')
  let result = html.match(/<title>(.+)<\/title>/i)
  if (result) return result[1].replace(/(?:\r\n|\r|\n)/g, ' ')
  return getFileSlug(file)
}

const getStaticPages = directory => {
  let id = 1

  return glob.sync('**/*.html', { cwd: directory, ignore: '**/*.junglet.html' })
    .map(file => ({
      _id: `static-${++id}`,
      _template: file,
      _slug: getFileSlug(file),
      _title: getHtmlTitle(file)
    }))
}

const getTemplates = directory => Object.assign(
    {},
    pug.list(directory),
    junglet.list(directory)
  )

// Map slugs to html files
const getStaticSlugs = data => {
  let _slugs = {}
  data.static_pages.forEach(p => { _slugs[p._slug] = p._template })
  return _slugs
}
const objSwitch = (value, obj) => obj[value] || obj['default']

const formatField = (value, formatter, field, local) => {
  switch (formatter) {
    case 'markdown': return markdown.render(value)
    case 'image': return '/' + local.uploads + '/' + value
    case 'object': {
      let o
      try { o = JSON.parse(value) } catch (err) { return {} }
      return formatData(o, field, local)
    }
    case 'list': {
      let list
      try { list = JSON.parse(value) } catch (err) { return [] }
      return list.map(item => formatField(item, field.field.type, field.field, local))
    }
  }
  return value
}

const formatData = (data, template, local) => {
  let d = Object.assign({}, data)
  ;(template.fields || []).forEach(field => {
    d[field.id] = formatField(d[field.id] || '', field.type, field, local)
  })
  return d
}

const compilePages = (_db, directory, { allPages, websitename, uploads }) => {
  if (!_db.pages || _db.pages.length === 0) return {}

  let _slugs = {}
  let defaultTemplate = Object.keys(_db.templates || {})[0]
  let compiledDir = path.join(directory, '.junglecompiled')

  fs.emptyDirSync(compiledDir)

  _db.pages.forEach(p => {
    let template = _db.templates[p._template] || defaultTemplate
    if (template) {
      let local = {
        all_pages: allPages,
        websitename,
        uploads,
        _home: p._slug === _db.home || (!_db.home && p._slug === 'index')
      }
      let engine = objSwitch(template.type, {
        'pug': pug,
        'junglet': junglet
      })

      if (engine) {
        let data
        try {
          data = engine.compile(Object.assign({}, formatData(p, template, local), local), directory)
        } catch (err) {
          // TODO: What to display instead? Maybe use error page?
          data = 'Error rendering template.'
        }
        let filename = `${p._slug}.html`

        fs.writeFileSync(path.join(compiledDir, filename), data)

        _slugs[p._slug] = `.junglecompiled/${filename}`
      }
    }
  })

  return _slugs
}

module.exports = {
  compile: (directory, local) => {
    perfy.start('compile')
    console.log('Compiling pages...')

    let _db = db.read(directory)

    _db.static_pages = getStaticPages(directory)
    _db.templates = getTemplates(directory)

    let allPages = [].concat(
      _db.static_pages,
      _db.pages
    )

    slugs = Object.assign(
      getStaticSlugs(_db),
      compilePages(_db, directory, Object.assign({}, local, { allPages }))
    )

    if (!slugs[_db.home]) _db.home = ''

    try {
      homeFile = slugs[_db.home || 'index']
    } catch (e) {
      console.log('Could not find homepage file')
    }

    db.write(directory, _db)

    let { time } = perfy.end('compile')
    let duration = colors.yellow(`[${time}s]`)
    console.log(`${Object.keys(slugs).length} pages compiled! ${duration}\n`)
  },

  getSlugs: () => slugs,
  getHomeFile: () => homeFile
}
