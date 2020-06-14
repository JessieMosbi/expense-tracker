const express = require('express')
const router = express.Router()

// routes files
const home = require('./modules/home.js')
const user = require('./modules/user.js')
const record = require('./modules/record.js')

const { authenticator } = require('../middleware/auth')

// set routes
router.use('/user', user)
router.use('/', authenticator, home)
router.use('/records', authenticator, record)

// handle error routes
router.get('*', (req, res) => {
  res.send('error page')
})

// return router middleware
module.exports = router
