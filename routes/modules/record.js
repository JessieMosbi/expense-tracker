const express = require('express')
const router = express.Router()

router.get('/new', (req, res) => {
  res.render('edit', { action: '/records/new' })
})

router.post('/new', (req, res) => {
  console.log(req.body)
  res.send('add record feat')
})

router.get('/edit/:id', (req, res) => {
  res.render('edit')
})

router.put('/edit/:id', (req, res) => {
  res.send('edit record feat')
})

router.delete('/:id', (req, res) => {
  res.send('delete record feat')
})

module.exports = router
