const express = require('express')
const cors = require('cors')
const app = express()
require('dotenv').config()
// Use the cors middleware
app.use(cors())
const axios = require('axios')
const cheerio = require('cheerio')

const userRoutes = require('./src/Routes/users')
const adminRoutes = require('./src/Routes/admin')
const productRoutes = require('./src/Routes/Products')
const reviewRoutes = require('./src/Routes/review')
const productsSearch = require('./src/Routes/productsSearch')
const errorHandler = require('./src/Middleware/errorHandler')
const { Pool } = require('pg')
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
})

const { syncDB, sequelize } = require('./src/Database/db')

syncDB()
// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }))

// Error handler middleware
app.use(errorHandler)

// parse application/json
app.use(express.json())
app.use('/user', userRoutes)
app.use('/admin', adminRoutes)
app.use('/search', productsSearch)

// app.use('/review', reviewRoutes)
// app.use('/product', productRoutes)
// const pool = require('./src/Database/Data')

app.get('/', (req, res) => {
  res.send('Hello World')
})

app.get('/test_sc', (req, res) => {
  async function scrapeProducts(url) {
    console.log(url)
    const { data } = await axios.get(url)

    // Load HTML content
    const $ = cheerio.load(data)

    const children = []

    // For direct children of an element with class 'your-class'
    $('.TextSizeWrap > *').each((index, element) => {
      children.push($(element).text().trim())
    })

    console.log(children)
  }

  // Use the function
  scrapeProducts('https://www.sportsdirect.com/adidas/adidas-running').then(
    (res) => console.log(res)
  )
})
app.get('/test', (req, res) => {
  async function fetchData(url) {
    const response = await axios.get(url)
    return response.data
  }

  async function extractData() {
    const html = await fetchData(
      'https://www.tesco.com/groceries/en-GB/search?query=anti%20dandruff%20shampoo'
    )
    const $ = cheerio.load(html)

    const products = []

    $('.product-details--wrapper').each((index, element) => {
      const productName = $(element).find('h3').text()
      const price = $(element).find('p').text()
      const pricePerUnit = $(element).find('p').text()

      products.push({
        productName,
        price,
        pricePerUnit,
      })
    })

    return products
  }

  // Example usage:
  extractData().then((data) => {
    console.log(JSON.stringify(data, null, 2))
  })
})

const port = process.env.PORT || 3000

app.listen(port)
