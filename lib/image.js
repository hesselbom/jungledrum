const sharp = require('sharp')
const mkdirp = require('mkdirp')
const path = require('path')

module.exports = {
  resize: (directory, uploads) => (file, width, height) => {
    if (!height) height = width

    let dir = path.join(directory, uploads, `${width}x${height}`)
    let p = path.join(uploads, `${width}x${height}`, file)
    let raw = path.join(directory, uploads, file)

    mkdirp(dir, function (err) {
      if (err) console.error(err)
      else {
        sharp(raw)
          .resize(width, height)
          .toFile(path.join(dir, file))
      }
    })

    return p
  }
}
