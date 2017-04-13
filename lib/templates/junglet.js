const path = require('path')
const glob = require('glob')
const fs = require('fs')
const jt = require('junglet')
const templates = require('./index')

module.exports = {
  list: directory => {
    let o = {}

    glob.sync('**/*.junglet.html', { cwd: directory, ignore: '**/_*.junglet.html' })
      .forEach(file => {
        let content = fs.readFileSync(file, 'utf8')
        let props = templates.extractTemplateProps(content)

        o[file] = Object.assign({
          type: 'junglet',
          fields: []
        }, props)
      })

    return o
  },

  compile: (data, directory) => {
    return jt.renderFile(path.join(directory, data._template), data)
  }
}
