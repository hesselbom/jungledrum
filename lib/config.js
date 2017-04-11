const jsonfile = require('jsonfile')
const path = require('path')

const configfile = '.jungleconfig'

module.exports = {
  read: (directory) => {
    let config = {}
    let configpath = path.join(directory, configfile)
    try { config = jsonfile.readFileSync(configpath) } catch (e) {}
    return config
  },

  write: (directory, data) => {
    let configpath = path.join(directory, configfile)
    jsonfile.writeFileSync(configpath, data)
  }
}
