const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.render('index', { records: [{ id: 1 }] })
})

module.exports = router
