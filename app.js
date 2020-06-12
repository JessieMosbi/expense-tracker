// params
const port = 3000

// include modules and files
const express = require('express')
const app = express()

// route
app.get('/', (req, res) => {
  res.send('Hello')
})

// start web server
app.listen(port, () => {
  console.log(`Web server is running in port ${port} with Express framework.`)
})
