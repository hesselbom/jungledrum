const md5 = require('md5')

module.exports = {
  toTitleCase: str =>
    str.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()),

  hashPassword: (str, salt) => md5(str + salt)
}
