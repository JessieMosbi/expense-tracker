// params
const port = 3000

// modules
const express = require('express')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const bodyParser = require('body-parser')
const session = require('express-session')
const passport = require('passport')
const flash = require('connect-flash')

// DB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1/expense-tracker', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error')
})

db.once('open', () => {
  console.log('mongodb connected')
})

// === server initiate ===
const app = express()
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

app.engine('handlebars', exphbs({ defaultLayout: 'main', helpers: require('./handlebarsHelper.js') }))
app.set('view engine', 'handlebars')
app.use(methodOverride('_method'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(flash())
app.use(session({
  secret: 'Jessie Secret Expense',
  cookie: {
    maxAge: 60 * 30 * 1000     // 30 分鐘後過期
  },
  resave: false,
  saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())
require('./config/passport.js')(passport) // Strategies must be configured prior to using them in a route

// message for view to use
app.use((req, res, next) => {
  // console.log(req.flash('success')) // 只能呼叫一次，若這裡先呼叫，底下就拿不到回傳物件了
  res.locals.user = req.user
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.welcome_msg = req.flash('success') // passport
  res.locals.error_msg = req.flash('error') // passport
  res.locals.success_msg = req.flash('success_msg') // my own
  res.locals.warning_msg = req.flash('warning_msg') // my own
  next() // 注意：沒加的話會一直繞圈圈...不知道下一棒要給誰
})

// Routes
app.use('/', require('./routes/home.js'))
app.use('/users', require('./routes/user.js'))
app.use('/records', require('./routes/record.js'))
app.use('/auth', require('./routes/auths.js'))

// server start
app.listen(process.env.PORT || port, () => {
  console.log(`Server listen to port ${port}`)
})
