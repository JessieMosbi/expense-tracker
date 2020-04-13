const mongoose = require('mongoose')
const User = require('../user.js')
const Category = require('../category.js')
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

  // user data
  const user = []
  user.push(
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

  // category data
  // const category = []
  // category.push(
  //   new Category({
  //     name: '家居物業',
  //     icon: '<i class="fas fa-home"></i>'
  //   }),
  //   new Category({
  //     name: '交通出行',
  //     icon: '<i class="fas fa-shuttle-van"></i>'
  //   }),
  //   new Category({
  //     name: '休閒娛樂',
  //     icon: '<i class="fas fa-grin-beam"></i>'
  //   }),
  //   new Category({
  //     name: '餐飲食品',
  //     icon: '<i class="fas fa-utensils"></i>'
  //   }),
  //   new Category({
  //     name: '其他',
  //     icon: '<i class="fas fa-pen"></i>'
  //   })
  // )

  // record data
  const record = []
  record.push(
    new Record({
      name: '買菜',
      userId: user[0]._id,
      categoryId: 4,
      amount: 987
    }),
    new Record({
      name: '去唱 KTV',
      userId: user[0]._id,
      categoryId: 3,
      amount: 298
    }),
    new Record({
      name: '午餐',
      userId: user[0]._id,
      categoryId: 4,
      amount: 75
    }),
    new Record({
      name: '晚餐',
      userId: user[1]._id,
      categoryId: 4,
      amount: 2199
    })
  )

  user.forEach((newUser) => {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) return console.log(err)
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) return console.log(err)
        newUser.password = hash
        newUser.save()
          .then(() => { })
          .catch((err) => console.log(err))
      })
    })
  })

  // category.forEach((newCategory) => {
  //   newCategory.save((err) => {
  //     if (err) return console.log(err)
  //   })
  // })

  record.forEach((newRecord) => {
    newRecord.save((err) => {
      if (err) return console.log(err)
    })
  })

  console.log('All done')
})
