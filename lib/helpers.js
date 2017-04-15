const hashPassword = require('password-hash-and-salt')

const slowEquals = (a, b) => {
  let diff = a.length ^ b.length
  for (let i = 0; i < a.length && i < b.length; i++) {
    diff |= a[i] ^ b[i]
  }
  return diff === 0
}

module.exports = {
  toTitleCase: str =>
    str.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()),

  verifyPassword: (password, hash, cb) => {
    if (!hash || !password) { return cb(null, false) }

    let iterations = 10000
    let key = hash.split('$')
    if (key.length !== 4 || !key[2] || !key[3]) {
      return cb('Hash not formatted correctly')
    }

    if (key[0] !== 'pbkdf2' || key[1] !== iterations.toString()) {
      return cb('Wrong algorithm and/or iterations')
    }

    hashPassword(password).hash(key[3], function (error, newHash) {
      if (error) {
        return cb(error)
      }
      cb(null, slowEquals(newHash, hash))
    })
  }
}
