const express = require('express')
const router = express.Router()
const passport = require('passport')

// 向 Facebook 發出請求
router.get('/facebook', passport.authenticate('facebook', {
  scope: ['email', 'public_profile']
}))

// 使用者同意授權後，Facebook 把資料發回來的路由
router.get('/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/',
  failureRedirect: 'user/login'
}))

module.exports = router
