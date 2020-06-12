// params
const port = process.env.PORT || 3000
if (process.env.NODE_ENV !== 'production') require('dotenv').config()

// include modules and files
const express = require('express')
const app = express()
const routes = require('./routes/index.js')

// DB
require('./config/mongoose.js')

// route
app.use(routes)

// start web server
app.listen(port, () => {
  console.log(`Web server is running in port ${port} with Express framework.`)
})
