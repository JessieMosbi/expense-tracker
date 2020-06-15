const { categories } = require('../../config/data.js')

const express = require('express')
const router = express.Router()

const Record = require('../../models/record.js')

const { dateFormat } = require('../../config/lib.js')

router.get('/', (req, res) => {
  // params
  let totalAmount = 0
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

  // Record.aggregate([
  //   { $match: recordFindCond },
  //   { $group: { _id: null, amount: { $sum: '$amount' } } }
  // ])
  //   .then(result => console.log(result))
  //   .catch(error => console.error(error))

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
