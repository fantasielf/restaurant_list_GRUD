const express = require('express')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const Restaurant = require('./models/restaurant')

const app = express()

mongoose.connect('mongodb://localhost/my-restaurants', { useNewUrlParser: true, useUnifiedTopology: true })

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: 'hbs' }))
app.set('view engine', 'hbs')

app.use(bodyParser.urlencoded({ extended: true }))

const db = mongoose.connection
db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  console.log('mongodb connected!')
})

app.get('/', (req, res) => {
  Restaurant.find()
    .lean() //清空資料
    .then(restaurants => res.render('index', { restaurants }))
    .catch(error => console.log(error))
})

//set router for new page
app.get('/restaurants/new', (req, res) => {
  return res.render('new')
})

//Set router for creat-new
app.post('/restaurants/', (req, res) => {
  const newRestaurant = req.body
  console.log(req.body)
  return Restaurant.create({
    name: newRestaurant.name,
    category: newRestaurant.category,
    image: newRestaurant.image,
    location: newRestaurant.location,
    phone: newRestaurant.phone,
    google_map: newRestaurant.google_map,
    description: newRestaurant.description,
    rating: newRestaurant.rating
  })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})


//Set router for viewing restaurant detail
app.get('/restaurants/:restaurant_id', (req, res) => {
  const id = req.params.restaurant_id
  return Restaurant.findById(id)
    .lean()
    .then((restaurant) => res.render('show', { restaurant }))
    .catch(error => console.log(error))
})

//Set router for edit page
app.get('/restaurants/:restaurant_id/edit', (req, res) => {
  const id = req.params.restaurant_id
  return Restaurant.findById(id)
    .lean()
    .then((restaurant) => res.render('edit', { restaurant }))
    .catch(error => console.log(error))
})

//Set router for edit-save
app.post('/restaurants/:restaurant_id/edit', (req, res) => {
  const id = req.params.restaurant_id
  return Restaurant.findById(id)
    .then(restaurant => {
      restaurant = Object.assign(restaurant, req.body) // replace the entire set of data
      return restaurant.save()
    })
    .then(restaurant => res.redirect(`/restaurants/${id}`))
    .catch(error => console.log(error))
})
//set router for delete function
app.post('/restaurants/:restaurant_id/delete', (req, res) => {
  console.log(req.params.restaurant_id)
  const id = req.params.restaurant_id
  return Restaurant.findById(id)
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})


app.listen(3000, () => {
  console.log('App is running on http://localhost:3000')
})
// Set the static files
app.use(express.static('public'))