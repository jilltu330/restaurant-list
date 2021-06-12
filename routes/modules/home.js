const express = require('express')
const router = express.Router()

const Restaurant = require('../../models/restaurant')

router.get('/', (req, res) => {
  const sortBy = req.query.sortBy || '-_id'
  Restaurant.find()
    .lean()
    .sort(sortBy)
    .then(restaurants => res.render('index', { restaurants, sortBy }))
    .catch(error => console.error(error))
})

module.exports = router
