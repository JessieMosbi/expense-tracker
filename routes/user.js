const express = require('express')
const router = express.Router()
const User = require('../models/user.js')
const passport = require('passport')
const bcrypt = require('bcryptjs')

// 透過 email 登入
router.get('/login', (req, res) => {
  res.render('login')
})

// passport local authentication
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  successFlash: '歡迎回來，', // flash a success message
  failureRedirect: '/users/login',
  failureFlash: '帳密錯誤，請重新登入' // flash an error message
}))

// 透過 email 註冊
router.get('/register', (req, res) => {
  res.render('register')
})

// 在註冊時輸入使用者名稱、email 與 password，所有都是必填欄位
router.post('/register', (req, res) => {
  const { name, email, password, password2 } = req.body
  const errors = []

  // 輸入值檢查
  if (!name || !email || !password || !password2) {
    errors.push({ message: '所有欄位均為必填' })
  }
  if (password !== password2) {
    errors.push({ message: '兩次密碼不一致' })
  }
  if (errors.length > 0) {
    res.render('register', { name, email, password, password2, errors })
    return false
  }

  User.findOne({ email })
    .then((user) => {
      if (user) {
        errors.push({ message: '此信箱已被申請，請更換信箱' })
        res.render('register', { name, email, password, password2, errors })
      }
      // 存入資料庫
      const newUser = new User({
        name,
        email,
        password
      })

      bcrypt.genSalt(10, (err, salt) => {
        if (err) return console.log(err)
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) return console.log(err)
          newUser.password = hash
          newUser.save()
            .then(() => {
              req.flash('success_msg', '您已成功註冊，請立即登入')
              res.redirect('/users/login')
            })
            .catch((err) => console.log(err))
          // FIXME: 用 then() catch 可以省略不寫，就不用接收 error 了欸，但下面就要，為何？
          // newUser.save((err) => {
          //   if (err) return console.log(err)
          //   res.redirect('/users/login')
          // })
        })
      })
    })
})

router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', '您已成功登出，若欲繼續使用請重新登入')
  res.redirect('/users/login')
})

module.exports = router
