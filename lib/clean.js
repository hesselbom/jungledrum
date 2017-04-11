const fs = require('fs-extra')
const path = require('path')
const yesno = require('yesno')

module.exports = (directory) => {
  yesno.ask('Are you sure you want to delete your jungledrum files?\nThis operation will still keep all your files but remove all traces of jungledrum.\ny/n', false, ok => {
    if (ok) {
      try {
        fs.removeSync(path.join(directory, '.jungledb'))
        fs.removeSync(path.join(directory, '.jungleconfig'))
        fs.removeSync(path.join(directory, '.junglecompiled'))
        console.log('\nAll traces of jungledrum is now gone!')
      } catch (e) {
        console.log('Something went wrong when deleting:', e)
      }
      process.exit()
    } else {
      console.log('\nDid nothing.')
      process.exit()
    }
  })
}
