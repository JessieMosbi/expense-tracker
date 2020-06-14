const express = require('express')
const router = express.Router()

const Record = require('../../models/record.js')

const { generateTemplateParams, dateFormat } = require('../../config/lib.js')

router.get('/new', (req, res) => {
  res.render('edit', generateTemplateParams('add'))
})

// test
const userId = '5e6cc60b2c086ac4ff1d13b6'

router.post('/new', (req, res) => {
  const errors = []
  const { name, date, category, amount, merchant } = req.body

  if (!name.trim() || !date.trim() || !amount.trim() || !category.trim()) errors.push({ message: '除了商家外，其餘欄位均為必填' })
  if (isNaN(Number(amount)) || Number(amount) < 0) errors.push({ message: '金額請輸入整數' })

  if (errors.length > 0) {
    res.render('edit', generateTemplateParams('add', req.body, errors))
    return false
  }

  Record.create({
    name, date, amount, userId, categoryId: category, merchant
  })
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

router.get('/edit/:id', (req, res) => {
  Record.findOne({ _id: req.params.id })
    .lean()
    .then(record => {
      record.date = dateFormat(record.date, '-')
      res.render('edit', generateTemplateParams('edit', record))
    })
    .catch(err => console.log(err))
})

router.put('/:id', (req, res) => {
  const errors = []
  const { name, date, category, amount, merchant } = req.body

  if (!name.trim() || !date.trim() || !amount.trim() || !category.trim()) errors.push({ message: '除了商家外，其餘欄位均為必填' })
  if (isNaN(Number(amount)) || Number(amount) < 0) errors.push({ message: '金額請輸入整數' })

  if (errors.length > 0) {
    req.body._id = req.params.id
    res.render('edit', generateTemplateParams('edit', req.body, errors))
    return false
  }

  Record.findOne({ _id: req.params.id })
    .then(record => {
      // TODO: 改良寫法
      record.name = name
      record.date = date
      record.amount = amount
      record.categoryId = category
      record.merchant = merchant
      return record.save()
    })
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

router.delete('/:id', (req, res) => {
  return Record.findOne({ _id: req.params.id, userId })
    .then(record => record.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

module.exports = router
