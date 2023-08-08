const express = require('express')
const app = express()
require('dotenv').config()

const userRoutes = require('./src/Routes/users')
const errorHandler = require('./src/Middleware/errorHandler')
const { Pool } = require('pg')
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'dec',
  password: 'admin',
  port: 5432,
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
// const pool = require('./src/Database/Data')
app.get('/', (req, res) => {
  res.send('Hello World')
})

const port = process.env.PORT || 3000

app.listen(port)
