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

// DB
require('./config/mongoose.js')

// web server setting
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs', helpers: require('./config/handlebarsHelper.js') }))
app.set('view engine', 'hbs')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

// route
app.use(routes)

// start web server
app.listen(port, () => {
  console.log(`Web server is running in port ${port} with Express framework.`)
})
