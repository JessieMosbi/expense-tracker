const express = require('express')
const router = express.Router()

router.get('/login', (req, res) => {
  res.send('User login page')
})

router.post('/login', (req, res) => {
  res.send('User login feat')
})

router.get('/register', (req, res) => {
  res.send('User register page')
})

router.post('/register', (req, res) => {
  res.send('User register feat')
})

router.post('/logout', (req, res) => {
  res.send('User logout feat')
})

module.exports = router
