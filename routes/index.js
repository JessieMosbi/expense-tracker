const express = require('express')
const router = express.Router()

// routes files
const home = require('./modules/home.js')
const user = require('./modules/user.js')
const record = require('./modules/record.js')

// set routes
router.use('/', home)
router.use('/user', user)
router.use('/records', record)

// handle error routes
router.get('*', (req, res) => {
  res.send('error page')
})

// return router middleware
module.exports = router
