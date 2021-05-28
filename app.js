//required packages used in this project
const express = require('express')
const app = express()
const port = 3000

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
  const keyword = req.query.keyword

  const restaurant = restaurantList.results.filter(restaurant => {
    const key = keyword.trim().toLowerCase()
    const name = restaurant.name.toLowerCase()
    const nameEN = restaurant.name_en.toLowerCase()
    const category = restaurant.category.toLowerCase()
    if (name.includes(key) || nameEN.includes(key) || category.includes(key)) {
      return true
    }
  })
  res.render('index', { restaurants: restaurant, keyword: keyword })
})

app.listen(port, () => {
  console.log(`Express is listing on localhost:${port}`)
})