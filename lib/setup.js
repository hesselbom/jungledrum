const prompt = require('prompt')
const db = require('./db')
const hashPassword = require('password-hash-and-salt')

prompt.message = ''

module.exports = (options) => {
  let { directory } = options

  console.log('Running jungledrum setup')

  prompt.start()
  prompt.get([
    {
      name: 'amountOfAdmins',
      description: 'How many admin users do you want?',
      type: 'integer',
      default: 1
    }
  ], (err, result) => {
    if (err) {
      console.log('Something went wrong.')
    } else {
      let { amountOfAdmins } = result
      let users = []

      if (amountOfAdmins < 1) {
        console.log('No admin users added')

        let _db = db.read(directory)
        _db.users = []
        db.write(directory, _db)

        return
      }

      let addUser = () => {
        console.log(`\nUser ${users.length + 1}`)

        prompt.get([
          {
            name: 'username',
            required: true,
            description: 'Username',
            message: 'Username must be provided and be unique',
            conform: value => {
              let existing = users.find(u => u.username === value)
              return !existing
            }
          },
          {
            name: 'password',
            required: true,
            hidden: true,
            replace: '*',
            description: 'Password',
            message: 'Password must be provided'
          }
        ], (err, result) => {
          if (err) return console.log('Something went wrong.')

          hashPassword(result.password).hash((err, password) => {
            if (err) return console.log('Something went wrong.')

            users.push({ username: result.username, password })

            if (users.length < amountOfAdmins) {
              addUser()
            } else {
              try {
                let _db = db.read(directory)
                _db.users = users
                db.write(directory, _db)
              } catch (e) {
                console.log('Something went wrong:', e)
              } finally {
                console.log('\nSuccessfully finished setup!')
              }
            }
          })
        })
      }
      addUser()
    }
  })
}
