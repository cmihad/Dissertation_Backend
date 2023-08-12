const express = require('express')
const router = express.Router()
const {
  getNumberOfUsers,
  deleteUserByEmail,
  getAllUsers,
} = require('../Util/userUtil')
const isAdmin = require('../Middleware/isAdmin')
router.get('/numberOfUsers', isAdmin, async (req, res, next) => {
  try {
    const number = await getNumberOfUsers()
    res.json(number)
  } catch (err) {
    next(err)
    console.error('Error fetching number of users:', err)
  }
})
router.delete('/deleteUserByEmail', isAdmin, async (req, res, next) => {
  try {
    const { email } = req.body

    const deleted = await deleteUserByEmail(email)
    res.json(deleted)
  } catch (err) {
    next(err)
    console.error('Error deleting the user', err)
  }
})
router.get('/getAllUsers', isAdmin, async (req, res, next) => {
  try {
    const allUsers = await getAllUsers()
    res.json(allUsers)
  } catch (err) {
    next(err)
    console.error('Error deleting the user', err)
  }
})
module.exports = router
