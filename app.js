// params
const port = process.env.PORT || 3000
if (process.env.NODE_ENV !== 'production') require('dotenv').config()

// include modules and files
const express = require('express')
const app = express()
const routes = require('./routes/index.js')

const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const flash = require('connect-flash')

const session = require('express-session')
const usePassport = require('./config/passport')

// DB
require('./config/mongoose.js')

// web server setting
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs', helpers: require('./config/handlebarsHelper.js') }))
app.set('view engine', 'hbs')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(flash())

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))
usePassport(app)

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  res.locals.warning_msg = req.flash('warning_msg')
  res.locals.error_msg = req.flash('error')
  next()
})

// route
app.use(routes)

// start web server
app.listen(port, () => {
  console.log(`Web server is running in port ${port} with Express framework.`)
})
