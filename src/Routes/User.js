// routes/users.js
const express = require('express')
const router = express.Router()
const db = require('../Database/Data')

router.post('/test', async (req, res) => {
  const { name, email, password } = req.body

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

module.exports = router
