const express = require('express')
const User = require('../Models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { getUserByEmail, deleteUserByEmail } = require('../Util/userUtil')
const { Pool } = require('pg')
const { errors } = require('pg-promise')
const verifyToken = require('../Middleware/verifyToken')
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

router.get('/profileByEmail', async (req, res, next) => {
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

router.post('/profile', async (req, res) => {
  try {
    const {
      userId,
      allergies,
      skinInfo,
      hairInfo,
      postalCode,
      annualIncome,
      gender,
      ethnicity,
      isCollegeGraduate,
    } = req.body

    const time = new Date()
    const createdAt = time.toISOString()
    const updatedAt = time.toISOString()

    const query = {
      text: 'INSERT INTO Profiles("userId", allergies, "skinInfo", "hairInfo", "postalCode", "annualIncome", gender, ethnicity, "isCollegeGraduate", "createdAt", "updatedAt") VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)',
      values: [
        userId,
        allergies,
        skinInfo,
        hairInfo,
        postalCode,
        annualIncome,
        gender,
        ethnicity,
        isCollegeGraduate,
        createdAt,
        updatedAt,
      ],
    }

    await pool.query(query)
    res.json({
      status: 'success',
      message: 'UserProfile data inserted successfully',
    })
  } catch (err) {
    console.error(err)
    res.json({
      status: 'error',
      message: 'There was an error processing your request',
    })
  }
})

router.post('/profileUpdate', async (req, res) => {
  try {
    const {
      userId,
      allergies,
      skinInfo,
      hairInfo,
      postalCode,
      annualIncome,
      gender,
      ethnicity,
      isCollegeGraduate,
    } = req.body

    const existingProfile = await pool.query(
      'SELECT * FROM Profiles WHERE "userId" = $1',
      [userId]
    )

    const time = new Date()
    const updatedAt = time.toISOString()

    if (existingProfile.rowCount > 0) {
      // Update existing profile
      const updateQuery = {
        text: 'UPDATE Profiles SET allergies = $2, "skinInfo" = $3, "hairInfo" = $4, "postalCode" = $5, "annualIncome" = $6, gender = $7, ethnicity = $8, "isCollegeGraduate" = $9, "updatedAt" = $10 WHERE "userId" = $1',
        values: [
          userId,
          allergies,
          skinInfo,
          hairInfo,
          postalCode,
          annualIncome,
          gender,
          ethnicity,
          isCollegeGraduate,
          updatedAt,
        ],
      }

      await pool.query(updateQuery)
      res.json({
        status: 'success',
        message: 'UserProfile data updated successfully',
      })
    } else {
      // Create new profile
      const createdAt = updatedAt
      const insertQuery = {
        text: 'INSERT INTO Profiles("userId", allergies, "skinInfo", "hairInfo", "postalCode", "annualIncome", gender, ethnicity, "isCollegeGraduate", "createdAt", "updatedAt") VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)',
        values: [
          userId,
          allergies,
          skinInfo,
          hairInfo,
          postalCode,
          annualIncome,
          gender,
          ethnicity,
          isCollegeGraduate,
          createdAt,
          updatedAt,
        ],
      }

      await pool.query(insertQuery)
      res.json({
        status: 'success',
        message: 'UserProfile data inserted successfully',
      })
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({
      status: 'error',
      message: 'There was an error processing your request',
    })
  }
})

router.delete('/closeAccount', verifyToken, async (req, res, next) => {
  try {
    const email = req.query.email
    console.log(email, 'check email')

    const user = await getUserByEmail(email)

    if (!user) {
      const err = new Error('User not found')
      err.status = 404
      next(err)
    } else {
      await deleteUserByEmail(email)
      res.status(200).json({ message: 'User deleted successfully' })
    }
  } catch (err) {
    next(err)
  }
})
module.exports = router
