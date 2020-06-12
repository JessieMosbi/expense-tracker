// params
const MONGODB_URL = process.env.MONGODB_URI || 'mongodb://127.0.0.1/expense-tracker'

// include modules and files
const mongoose = require('mongoose')

// DB connect
mongoose.connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
const db = mongoose.connection

// catch error
db.on('error', () => {
  console.log('mongodb error')
})

// catch open
db.once('open', () => {
  console.log('mongodb connected')
})
