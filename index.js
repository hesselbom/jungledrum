#!/usr/bin/env node
const fs = require('fs')
const setup = require('./lib/setup')
const server = require('./lib/server')
const clean = require('./lib/clean')

let args = process.argv.slice(2)
let directory = process.cwd()

try {
  if (args.length > 0 && fs.existsSync(args[0])) {
    directory = args[0]
  }
} catch (_) {}

let config = require('./lib/config').read(directory)
let port = (config.port && parseInt(config.port)) || 3000
let secret = config.secret || 'jungledrum'
let adminurl = '/' + (config.adminurl || '_admin')
let name = config.name || 'jungledrum'
let uploads = config.uploads || 'uploads'

let help = () => {
  console.log('Usage:\n')
  console.log('    jungledrum        Runs jungledrum on current directory')
  console.log('    jungledrum [dir]  Runs jungledrum on specified directory')
  console.log('    jungledrum help   Shows this help section')
  console.log('    jungledrum setup  Wizard for setting up admin users')
  console.log('    jungledrum clean  Clean directory from all things jungledrum')
}

if (args.indexOf('setup') > -1) {
  setup({ secret, directory })
} else if (args.indexOf('help') > -1) {
  help()
} else if (args.indexOf('clean') > -1) {
  clean(directory)
} else {
  server({ port, directory, adminurl, name, uploads, secret })
}
