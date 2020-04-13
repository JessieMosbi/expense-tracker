const express = require('express')
const router = express.Router()

// const Category = require('../models/category.js')
const Record = require('../models/record.js')
const { dateFormat } = require('../config/lib.js')
const { authenticated } = require('../config/auth.js')

// params
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
// Category.find()
//   .lean()
//   .exec((err, items) => {
//     if (err) return console.log(err)
//     items.forEach((item) => categories.push(item))
//   })

function generateTemplateParams(kind, record, errors) {
  const params = {}
  params.action = (kind === 'add') ? '/records/new' : `/records/${record._id}?_method=PUT`
  params.note = (kind === 'add') ? '請輸入你的支出' : '請修改你的支出'
  params.buttonName = (kind === 'add') ? '新增支出' : '送出'
  params.categories = categories
  if (record) {
    params.name = record.name
    params.date = record.date
    params.category = record.categoryId || record.category
    params.merchant = record.merchant
    params.amount = record.amount
    params.errors = errors
  }
  return params
}

// 新增一筆支出
router.get('/new', authenticated, (req, res) => {
  // const script = `
  // <script>
  // /*
  // $(function () {
  //   $('#date').datepicker();
  // })
  // */
  // </script>
  // `
  res.render('edit', generateTemplateParams('add'))
})

router.post('/new', authenticated, (req, res) => {
  // 檢查：每個欄位均為必填
  const errors = []
  const { name, date, amount, category, merchant } = req.body
  if (!name.trim() || !date.trim() || !amount.trim() || !category.trim()) errors.push({ message: '除了商家外，其餘欄位均為必填' })
  if (isNaN(Number(amount))) errors.push({ message: '金額請輸入整數' })

  if (errors.length > 0) {
    res.render('edit', generateTemplateParams('add', req.body, errors))
    return false
  }

  // When you create a user document, Mongoose will cast the value to a native JavaScript date using the Date() constructor.
  const record = new Record({
    name, date, amount, userId: req.user._id, categoryId: category, merchant
  })

  record.save((err) => {
    if (err) return console.log(err)
    // TODO: 導向時，回到原本 select category 的狀態下（此變數太常用了，感覺要存起來）
    // res.redirect('/?' + 'category=' + req.query.selCategory)
    res.redirect('/')
  })
})

// 編輯支出的所有屬性 (一次只能編輯一筆)
router.get('/edit/:id', authenticated, (req, res) => {
  Record.findOne({ _id: req.params.id })
    .lean()
    .exec((err, record) => {
      if (err) return console.log(err)
      record.date = dateFormat(record.date, '-') // input date 要給「-」而非「/」
      res.render('edit', generateTemplateParams('edit', record))
    })
})

router.put('/:id', authenticated, (req, res) => {
  // 檢查：每個欄位均為必填
  const errors = []
  const { name, date, amount, category } = req.body
  if (!name || !date || !amount || !category) errors.push({ message: '除了商家外，每個欄位均為必填' })
  if (isNaN(Number(amount))) errors.push({ message: '金額請輸入整數' })

  if (errors.length > 0) {
    req.body._id = req.params.id
    res.render('edit', generateTemplateParams('edit', req.body, errors))
    return false
  }

  Record.findById(req.params.id, (err, record) => {
    if (err) return console.log(err)
    record.name = req.body.name
    record.date = req.body.date
    record.merchant = req.body.merchant
    record.amount = req.body.amount
    record.categoryId = req.body.category

    record.save((err) => {
      if (err) return console.log(err)
      res.redirect('/')
    })
  })
})

// 刪除任何一筆支出 (一次只能刪除一筆)
router.delete('/:id', authenticated, (req, res) => {
  Record.findById(req.params.id, (err, record) => {
    if (err) return console.log(err)
    record.remove((err) => {
      if (err) return console.log(err)
      res.redirect('/')
    })
  })
})

module.exports = router
