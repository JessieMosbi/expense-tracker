const express = require('express')
const router = express.Router()

// const Category = require('../models/category.js')
const Record = require('../models/record.js')
const { dateFormat } = require('../config/lib.js')
const { authenticated } = require('../config/auth.js')

// FIXME: 下面不行捏...
// passport.authenticate 是個 middleware，要傳入 req, res and next 的參數去執行此 middleware: middleware(req, res, next)
// 下面寫法是將此 middleware 傳遞給 Express 去執行 (不需另外提供參數，function 可以直接作為參數傳遞)，而非直接在 Express route.get 裡面執行 authenticate 並回傳結果 (function() >> 執行的意思)
// const passport = require('passport')
// router.get('/', passport.authenticate('local'), (req, res) => {

router.get('/', authenticated, (req, res) => {
  // (ok) 在首頁一次瀏覽所有支出的清單
  // (ok) 在首頁看到所有支出清單的總金額
  // (ok) 在首頁可以根據支出「類別」篩選支出；總金額的計算只會包括被篩選出來的支出總和

  const recordFindCond = { userId: req.user._id }
  let selCategory = req.query.category
  if (selCategory && selCategory !== 'all') recordFindCond.categoryId = selCategory
  else selCategory = 'all'
  let selMonth = req.query.month
  if (selMonth && selMonth !== 'all') {
    const today = new Date
    const thisYear = today.getUTCFullYear()
    recordFindCond.date = { $gte: `${thisYear}-${selMonth}-1`, $lte: `${thisYear}-${selMonth}-31` }
  }
  else selMonth = 'all'

  let totalAmount = 0
  const categories = [
    {
      id: 1,
      name: '家居物業',
      icon: '<i class="fas fa-home"></i>'
    },
    {
      id: 2,
      name: '交通出行',
      icon: '<i class="fas fa-shuttle-van"></i>'
    },
    {
      id: 3,
      name: '休閒娛樂',
      icon: '<i class="fas fa-grin-beam"></i>'
    },
    {
      id: 4,
      name: '餐飲食品',
      icon: '<i class="fas fa-utensils"></i>'
    },
    {
      id: 5,
      name: '其他',
      icon: '<i class="fas fa-pen"></i>'
    }
  ]
  categories.push({
    id: 'all',
    name: '所有類別'
  })
  const months = []
  for (let i = 1; i <= 12; i++) {
    months.push({ id: i, name: `${i} 月份` })
  }
  months.push({
    id: 'all',
    name: '所有月份'
  })

  // 此使用者的 record
  Record.find(recordFindCond)
    .sort({ date: 'DESC' })
    .lean()
    .exec((err, records) => {
      if (err) return console.log(err)

      // TODO: 看 mongoose 有沒有 sum
      records.forEach((record, index) => {
        records[index].icon = categories.find((category) => String(category.id) === String(record.categoryId)).icon

        const date = new Date(record.date)
        records[index].date = dateFormat(date, '/')

        totalAmount += record.amount
      })

      return res.render('index', { months, categories, records, totalAmount, selCategory, selMonth })
    })
})

module.exports = router
