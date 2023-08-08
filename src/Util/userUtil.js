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
// console.log(getUserByEmail('cmihad@gmail.com10'))rs

module.exports = { getUserByEmail }
