//required packages used in this project
const express = require('express')
const mongoose = require('mongoose')
const app = express()
const port = 3000

const Restaurant = require('./models/restaurant')

mongoose.connect('mongodb://localhost/restaurant', { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', () => {
  console.log('mongodb connected!')
})

//required express-handlebars here
const exphbs = require('express-handlebars')
// const restaurantList = require('./restaurant.json') //change json to seeder

//setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

//setting static files
app.use(express.static('public'))

app.use(express.urlencoded({ extended: true }))

// index route
app.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .then(restaurants => res.render('index', { restaurants }))
    .catch(error => console.error(error))
})

//new route 新增資料
app.get('/restaurants/new', (req, res) => {
  return res.render('new')
})

app.post('/restaurants', (req, res) => {
  return Restaurant.create({
    name: req.body.name,
    name_en: req.body.name_en,
    category: req.body.category,
    image: req.body.image,
    location: req.body.location,
    phone: req.body.phone,
    google_map: req.body.google_map,
    rating: req.body.rating,
    description: req.body.description,
  })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

//detail route
app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then((restaurant) => res.render('detail', { restaurant }))
    .catch(error => console.log(error))
})

//edit route
app.get('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then((restaurant) => res.render('edit', { restaurant }))
    .catch(error => console.log(error))
})

app.post('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .then(restaurant => {
      restaurant.name = req.body.name,
        restaurant.name_en = req.body.name_en,
        restaurant.category = req.body.category,
        restaurant.image = req.body.image,
        restaurant.location = req.body.location,
        restaurant.phone = req.body.phone,
        restaurant.google_map = req.body.google_map,
        restaurant.rating = req.body.rating,
        restaurant.description = req.body.description,
        restaurant.save()
    })
    .then(() => res.redirect(`/restaurants/${id}`))
    .catch(error => console.log(error))
})

//delete route
app.post('/restaurants/:id/delete', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .then(todo => todo.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

//search route
app.get('/search', (req, res) => {
  const keyword = req.query.keyword.trim()

  const noResultNotice = `你搜尋的${keyword}沒有符合的餐廳`
  const emptySearchNotice = '請輸入想搜尋的餐廳或分類'

  if (keyword.length === 0) {
    res.render('index', { notice: emptySearchNotice })
    return
  }

  const restaurants = restaurantList.results.filter(restaurant => {
    const key = keyword.toLowerCase()
    const name = restaurant.name.toLowerCase()
    const nameEN = restaurant.name_en.toLowerCase()
    const category = restaurant.category.toLowerCase()
    if (name.includes(key) || nameEN.includes(key) || category.includes(key)) {
      return true
    }
  })

  if (restaurants.length === 0) {
    res.render('index', { keyword: keyword, notice: noResultNotice })
  } else {
    res.render('index', { restaurants: restaurants, keyword: keyword })
  }

})

app.listen(port, () => {
  console.log(`Express is listing on localhost:${port}`)
})