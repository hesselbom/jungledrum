const jsonfile = require('jsonfile')
const path = require('path')

const dbfile = '.jungledb'

module.exports = {
  read: (directory) => {
    let db = {}
    let dbpath = path.join(directory, dbfile)
    try { db = jsonfile.readFileSync(dbpath) } catch (e) {}
    return db
  },

  write: (directory, data) => {
    let dbpath = path.join(directory, dbfile)
    jsonfile.writeFileSync(dbpath, data)
  }
}
/*
{
  "templates: { "...": { "fields": [], "type": "pug" } },
  "pages": [{ "_id": "123", "_template": "...", "_slug": "...", "_title": "...", "fieldxyz": "..." }],
  "static_pages": [{ "_id": "static-123", "_template": "...", "_slug": "...", "_title": "..." }],
  "home": "...",
  "users": [{ "username": "...", "password": "..." }]
}
*/
