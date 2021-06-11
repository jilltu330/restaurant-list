const express = require('express')
const router = express.Router()

const Restaurant = require('../../models/restaurant')

//define restaurant route
router.get('/new', (req, res) => {
  return res.render('new')
})

//Search
router.get('/search', (req, res) => {
  const keyword = req.query.keyword.trim()
  const noResultNotice = `你搜尋的${keyword}沒有符合的餐廳`
  const emptySearchNotice = '請輸入想搜尋的餐廳或分類'
  const sortBy = req.query.sortBy || '_id'

  if (keyword.length === 0) {
    res.render('index', { notice: emptySearchNotice })
    return
  }

  return Restaurant.find({
    $or: [
      { name: { $regex: `${keyword}`, $options: 'i' } },
      { name_en: { $regex: `${keyword}`, $options: 'i' } },
      { category: { $regex: `${keyword}`, $options: 'i' } }
    ]
  })
    .lean()
    .sort(sortBy)
    .then(restaurants => {
      if (restaurants.length === 0) {
        res.render('index', { keyword, notice: noResultNotice })
      } else {
        res.render('index', { restaurants, keyword, sortBy })
      }
    })
    .catch(error => console.log(error))
})

//Create
router.post('/', (req, res) => {
  return Restaurant.create(req.body)
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

//Detail
router.get('/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then((restaurant) => res.render('detail', { restaurant }))
    .catch(error => console.log(error))
})

//Edit
router.get('/:id/edit', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then((restaurant) => res.render('edit', { restaurant }))
    .catch(error => console.log(error))
})

router.put('/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .then(restaurant => {
      Object.assign(restaurant, req.body)
      restaurant.save()
    })
    .then(() => res.redirect(`/restaurants/${id}`))
    .catch(error => console.log(error))
})

//Delete
router.delete('/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

module.exports = router