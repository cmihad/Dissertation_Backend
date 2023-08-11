const express = require('express')
const User = require('../Models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { getUserByEmail } = require('../Util/userUtil')
const { Pool } = require('pg')
const { errors } = require('pg-promise')
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
})
const secret = process.env.JWT_SECRET
const router = express.Router()
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, age, phoneNumber, address } = req.body

    const hashedPassword = await bcrypt.hash(password, 10)
    // Insert the data into the PostgreSQL
    const time = new Date()

    const createdAt = time.toISOString()
    const updatedAt = time.toISOString()
    password
    const query = {
      text: 'INSERT INTO users( name, email, password, age ,"phoneNumber",address ,"createdAt", "updatedAt") VALUES( $1, $2, $3, $4 ,$5, $6, $7 ,$8)',
      values: [
        name,
        email,
        hashedPassword,
        age,
        phoneNumber,
        address,
        createdAt,
        updatedAt,
      ],
    }
    await pool.query(query)

    res.json({ status: 'success', message: 'Data inserted successfully' })
  } catch (err) {
    console.error(err)
    res.json({
      status: 'error',
      message: 'There was an error processing your request',
    })
  }
})

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await getUserByEmail(email)
    if (!user) {
      const err = new Error('User not found')
      err.status = 404
      next(err)
    } else {
      const match = await bcrypt.compare(password, user.password)
      if (match) {
        const token = jwt.sign({ userId: user.id }, secret, {
          expiresIn: '90d',
        })

        // Return the token to the client
        res.json({ token, user })
      } else {
        err.status = 404
        next(err)
      }
    }
  } catch (err) {
    next(err)
  }
})

router.get('/logout', async (req, res, next) => {
  try {
    const { email } = req.body // You probably don't need the password to logout a user
    const user = await getUserByEmail(email)

    if (!user) {
      const err = new Error('User not found')
      err.status = 404
      next(err)
    } else {
      res.json({ message: 'User logged out successfully' })
    }
  } catch (err) {
    next(err)
  }
})

router.get('/profile', async (req, res, next) => {
  try {
    const email = req.query.email // Extract email from query parameters
    const user = await getUserByEmail(email)

    if (!user) {
      const err = new Error('User not found')
      err.status = 404
      next(err)
    } else {
      res.json(user) // Send the user's data in response
    }
  } catch (err) {
    next(err)
  }
})
router.get('/test', async (req, res, next) => {
  res.send('HELLO WORLD test purposes')
})
module.exports = router
