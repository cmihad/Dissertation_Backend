const express = require('express')
const app = express()
require('dotenv').config()

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }))

// parse application/json
app.use(express.json())

const user = require('./src/Models/User')

const db = require('./src/Database/Data')

app.get('/', (req, res) => {
  res.send('Hello World')
})

app.post('/zone', async (req, res) => {
  console.log(req.body)
})

app.post('/test', async (req, res) => {
  const { name, email, password } = req.body
  res.send('working')

  try {
    const result = await db.one(
      'INSERT INTO users(name, email, password) VALUES($1, $2, $3) RETURNING *',
      [name, email, password]
    )
    res.status(201).json({
      status: 'success',
      data: result,
      message: 'User created',
    })
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Database error',
    })
    console.log(err)
  }
})

const port = process.env.PORT || 3000

app.listen(port)
