const { User } = require('../Models/User') // Import User model

const getUserByEmail = async (email) => {
  try {
    const user = await User.findOne({ where: { email: email } })
    if (user) {
      console.log(user.toJSON())
      return user
    } else {
      console.log('No user found with the provided email.')
    }
  } catch (err) {
    console.error('Error occurred:', err)
  }
}

const getNumberOfUsers = async () => {
  try {
    const number = await User.count()
    console.log(`Number of users: ${number}`)
    return number
  } catch (error) {
    console.error('Error occurred:', error)
  }
}
const deleteUserByEmail = async (email) => {
  try {
    const result = await User.destroy({ where: { email: email } })
    if (result) {
      console.log(`User with email ${email} has been deleted.`)
    } else {
      console.log(`No user found with email ${email}.`)
    }
  } catch (error) {
    console.error('Error occurred:', error)
  }
}
const getAllUsers = async () => {
  try {
    const users = await User.findAll()
    if (users && users.length) {
      console.log('List of all users:')
      users.forEach((user) => {
        user.toJSON()
      })
      return users
    } else {
      console.log('No users found.')
      return []
    }
  } catch (error) {
    console.error('Error occurred:', error)
  }
}
// console.log(getUserByEmail('cmihad@gmail.com10'))rs

module.exports = {
  getUserByEmail,
  getNumberOfUsers,
  deleteUserByEmail,
  getAllUsers,
}
