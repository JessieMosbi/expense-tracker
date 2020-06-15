// require modules and files
const mongoose = require('mongoose')
const User = require('../user.js')
const Record = require('../record.js')
const bcrypt = require('bcryptjs')

// DB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1/expense-tracker', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error')
})

db.once('open', () => {
  console.log('mongodb connected')

  const users = []
  users.push(
    new User({
      name: 'user1',
      email: 'user1@example.com',
      password: '12345678'
    }),
    new User({
      name: 'user2',
      email: 'user2@example.com',
      password: '12345678'
    })
  )
  const records = [
    {
      name: '買菜',
      categoryId: 4,
      amount: 987
    },
    {
      name: '去唱 KTV',
      categoryId: 3,
      amount: 298
    },
    {
      name: '午餐',
      categoryId: 4,
      amount: 75
    },
    {
      name: '晚餐',
      categoryId: 4,
      amount: 2199
    }
  ]

  // User save method (非同步)
  const saveSeed = (user) => {
    return new Promise((resolve, reject) => {
      bcrypt
        .genSalt(10)
        .then(salt => bcrypt.hash(user.password, salt))
        .then(hash => {
          user.password = hash
          return user.save() // return a promise, it will wait
        })
        .then(user => {
          return Promise.all(records.map(record => {
            record.userId = user._id
            return saveRecord(record, user.name)
          }))
        })
        .then(record => resolve(record))
        .catch(err => reject(err))
    })
  }

  // Record save method (非同步)
  const saveRecord = (record, username) => {
    return new Promise((resolve, reject) => {
      Record.create(record)
        .then(() => resolve(`${username}'s ${record.name} create successfully.`))
        .catch(err => reject(err))
    })
  }

  // use Promise.all to deal with promises
  Promise.all(users.map(user => saveSeed(user)))
    .then(messages => {
      messages.forEach(msg => console.log(msg))
      process.exit()
    })
    .catch(err => console.log(err))

  // only one promise
  /*
  saveSeed(users[0])
    .then(user => console.log(user))
    .catch(err => console.log(err))
  */

  /*
   saveRecord(records[0])
     .then(msg => console.log(msg))
     .catch(err => console.log(err))
   */
})
