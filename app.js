//required packages used in this project
const express = require('express')
const mongoose = require('mongoose')
const app = express()
const port = 3000

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
const restaurantList = require('./restaurant.json')

//setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

//setting static files
app.use(express.static('public'))

//route setting
app.get('/', (req, res) => {
  res.render('index', { restaurants: restaurantList.results })
})

app.get('/restaurants/:restaurant_id', (req, res) => {
  const restaurant = restaurantList.results.find(restaurant => restaurant.id.toString() === req.params.restaurant_id)
  res.render('show', { restaurant: restaurant })
})

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