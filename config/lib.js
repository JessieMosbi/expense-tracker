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

module.exports = {
  generateTemplateParams: (kind, record, errors) => {
    const params = {}
    params.action = (kind === 'add') ? '/records/new' : `/records/${record._id}?_method=PUT`
    params.note = (kind === 'add') ? '請輸入你的支出' : '請修改你的支出'
    params.buttonName = (kind === 'add') ? '新增支出' : '送出'
    params.categories = categories
    if (record) {
      params.name = record.name
      params.date = record.date
      params.category = record.category || record.categoryId
      params.amount = record.amount
      params.merchant = record.merchant
      params.errors = errors
    }

    return params
  },
  dateFormat: (date, splitChar) => {
    const year = date.getFullYear()
    const month = ('0' + (date.getMonth() + 1)).substr(-2)
    const day = ('0' + date.getDate()).substr(-2)

    return year + splitChar + month + splitChar + day
  }
}
