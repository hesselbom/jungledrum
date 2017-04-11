const path = require('path')
const glob = require('glob')
const pug = require('pug')
const lex = require('pug-lexer')
const fs = require('fs')
const templates = require('./index')

let getVariable = code => {
  let result = code.match(/^\s*([a-zA-Z_$][0-9a-zA-Z_$]*)\s*$/)
  return result && result[1]
}

let getFields = (content, filename) => {
  let tokens = lex(content, { filename })
  let fields = []

  tokens.forEach(token => {
    let { val, type } = token

    if (type === 'code' || type === 'interpolated-code') {
      let variable = getVariable(val)

      if (variable && !fields.find(f => variable === f.id)) {
        fields.push({
          id: variable,
          type: 'text'
        })
      }
    }
  })

  return fields
}

module.exports = {
  list: directory => {
    let o = {}

    glob.sync('**/*.pug', { cwd: directory, ignore: '**/_*.pug' })
      .forEach(file => {
        let content = fs.readFileSync(file, 'utf8')
        let props = templates.extractTemplateProps(content)

        o[file] = Object.assign({
          type: 'pug',
          fields: getFields(content, file)
        }, props)
      })

    return o
  },

  compile: (data, directory) => {
    return pug.renderFile(path.join(directory, data._template), data)
  }
}
