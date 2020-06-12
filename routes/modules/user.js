const express = require('express')
const router = express.Router()

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', (req, res) => {
  res.send('User login feat')
})

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  res.send('User register feat')
})

router.get('/logout', (req, res) => {
  res.send('User logout feat')
})

module.exports = router
