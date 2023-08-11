const express = require('express')
const app = express()
require('dotenv').config()

const userRoutes = require('./src/Routes/users')
const productRoutes = require('./src/Routes/Products')
const reviewRoutes = require('./src/Routes/review')
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

// app.use('/review', reviewRoutes)
// app.use('/product', productRoutes)
// const pool = require('./src/Database/Data')

app.get('/', (req, res) => {
  res.send('Hello World')
})

const port = process.env.PORT || 3000

app.listen(port)
