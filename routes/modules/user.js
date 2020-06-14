const express = require('express')
const router = express.Router()

const passport = require('passport')

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/user/login',
  failureFlash: true
}))

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  res.send('User register feat')
})

router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', '您已成功登出，若欲繼續使用請重新登入')
  res.redirect('/user/login')
})

module.exports = router
