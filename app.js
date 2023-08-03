const express = require('express')
const app = express()
require('dotenv').config()
const user = require('./src/Models/User')
const Users = require('./src/Routes/User')
const db = require('./src/Database/Data')
app.get('/', (req, res) => {
  res.send('Hello World')
  console.log(db)
})

app.post('/test', async (req, res) => {
  // const { name, email, password } = req.body
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
