// TODO: 跟 record 重複了
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

const express = require('express')
const router = express.Router()

const Record = require('../../models/record.js')

const { dateFormat } = require('../../config/lib.js')

router.get('/', (req, res) => {
  // params
  let totalAmount = 0
  // TODO: 為何會累加？
  const newCategories = [...categories]
  newCategories.push({ id: 'all', name: '所有類別' })

  const months = [{ id: 'all', name: '所有月份' }]
  for (let i = 1; i <= 12; i++) {
    months.push({ id: i, name: `${i} 月份` })
  }
  const recordFindCond = { userId: req.user._id }

  let selCategory = req.query.category
  if (selCategory && selCategory !== 'all') recordFindCond.categoryId = selCategory
  else selCategory = 'all'

  let selMonth = req.query.month
  if (selMonth && selMonth !== 'all') {
    const today = new Date()
    const thisYear = today.getUTCFullYear()
    recordFindCond.date = { $gte: `${thisYear}-${selMonth}-1`, $lte: `${thisYear}-${selMonth}-31` }
  } else selMonth = 'all'

  // TODO: 看 mongoose 有沒有 sum
  Record.find(recordFindCond)
    .lean()
    .sort({ _id: 'DESC' })
    .then(records => {
      records.forEach((record, index) => {
        records[index].icon = categories.find(category => String(category.id) === String(record.categoryId)).icon

        const date = new Date(record.date)
        records[index].date = dateFormat(date, '/')

        totalAmount += record.amount
      })

      res.render('index', { months, categories: newCategories, records, totalAmount, selCategory, selMonth })
    })
    .catch(error => console.error(error))
})

module.exports = router
