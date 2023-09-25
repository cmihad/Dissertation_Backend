const express = require('express')
const { fetchUserWithSearchedItem } = require('../Models/User')
const { Pool } = require('pg')
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
})

const router = express.Router()

/**
 * @route POST /create
 * @group Search - Operations related to user searches
 * @param {string} userId.body.required - The ID of the user performing the search
 * @param {string} searchTerm.body.required - The term the user searched for
 * @returns {object} 200 - An object indicating success and a message
 * @returns {object} 400 - Bad request response
 */

router.post('/create', async (req, res) => {
  try {
    const { userId, searchTerm } = req.body
    const searchDate = new Date().toISOString()
    const createdAt = new Date().toISOString()
    const updatedAt = new Date().toISOString()

    const query = {
      text: 'INSERT INTO searcheds("userId", "searchTerm", "searchDate", "createdAt", "updatedAt") VALUES($1, $2, $3, $4, $5)',
      values: [userId, searchTerm, searchDate, createdAt, updatedAt],
    }

    await pool.query(query)
    res.json({
      status: 'success',
      message: 'Search data inserted successfully',
    })
  } catch (err) {
    console.error(err)
    res.json({
      status: 'error',
      message: 'There was an error processing your request',
    })
  }
})

/**
 * @route GET /:userId
 * @group Search - Operations related to user searches
 * @param {string} userId.path.required - The ID of the user to retrieve searches for
 * @returns {object} 200 - An object containing searched data for the given userId
 * @returns {object} 404 - Not Found, if userId is not provided or not found
 */

router.get('/:userId', async (req, res, next) => {
  try {
    console.log('try atleast')
    const userId = req.params.userId

    if (!userId) {
      const err = new Error('User ID not provided')
      err.status = 404
      return next(err)
    }

    const data = await fetchUserWithSearchedItem(userId)
    res.json({ data })
  } catch (err) {
    next(err)
  }
})

module.exports = router
