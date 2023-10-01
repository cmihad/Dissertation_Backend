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
const orders = require('./src/Routes/order')
const searched = require('./src/Routes/searched')
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
app.use('/searched', searched)
app.use('/order', orders)

// app.use('/review', reviewRoutes)
// app.use('/product', productRoutes)
// const pool = require('./src/Database/Data')

const port = process.env.PORT || 3000

app.listen(port)
