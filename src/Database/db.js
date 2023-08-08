const { Sequelize } = require('sequelize')
const { User } = require('../Models/User')
// Set up a connection
const sequelize = new Sequelize('dec', 'postgres', 'admin', {
  host: 'localhost',
  dialect: 'postgres',
})
// Sync the model with the database (creates a table if it doesn't exist)

User.sync({ force: false })
  .then(() => console.log('User table created successfully'))
  .catch((err) => console.error('Failed to create User table:', err))
const syncDB = async () => {
  try {
    await sequelize.sync()
    console.log('Table created successfully')
  } catch (err) {
    console.error('Error creating table', err)
  }
}

module.exports = { syncDB, sequelize, User }
