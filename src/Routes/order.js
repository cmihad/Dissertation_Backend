const express = require('express')
const { fetchUserWithOrdersById } = require('../Models/User')
const { Pool } = require('pg')
const verifyToken = require('../Middleware/verifyToken')
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
})

const router = express.Router()

router.get('/test', async (req, res, next) => {
  res.send('HELLO WORLD test purposes')
})

router.post('/create', async (req, res) => {
  try {
    const { userId, userEmail, productName, price } = req.body

    const purchaseDate = new Date().toISOString()
    const createdAt = purchaseDate
    const updatedAt = purchaseDate

    const query = {
      text: 'INSERT INTO orders("userId", "userEmail", "productName", "price", "purchaseDate", "createdAt", "updatedAt") VALUES($1, $2, $3, $4, $5, $6, $7)',
      values: [
        userId,
        userEmail,
        productName,
        price,
        purchaseDate,
        createdAt,
        updatedAt,
      ],
    }

    await pool.query(query)
    res.json({
      status: 'success',
      message: 'Order data inserted successfully',
    })
  } catch (err) {
    console.error(err)
    res.json({
      status: 'error',
      message: 'There was an error processing your request',
    })
  }
})
router.get('/:userId', async (req, res, next) => {
  try {
    const userId = req.params.userId

    if (!userId) {
      const err = new Error('User not found')
      err.status = 404
      next(err)
    } else {
      const data = await fetchUserWithOrdersById(userId)
      res.json({ data })
    }
  } catch (err) {
    next(err)
  }
})

module.exports = router
