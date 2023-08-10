const { Sequelize } = require('sequelize')
const { User } = require('../Models/User')
// Set up a connection
// const sequelize = new Sequelize('dec', 'postgres', 'admin', {
//   host: 'localhost',
//   dialect: 'postgres',
// })
// // Sync the model with the database (creates a table if it doesn't exist)

const DATABASE_NAME = process.env.DB_NAME
const DATABASE_USER = process.env.DB_USER
const DATABASE_PASSWORD = process.env.DB_PASS
const DATABASE_HOST = process.env.DB_HOST

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  dialect: 'postgres',
  pool: {
    max: 10, // maximum number of connection in pool
    min: 0, // minimum number of connection in pool
    acquire: 30000, // maximum time, in milliseconds, that pool will try to get connection before throwing error
    idle: 10000, // maximum time, in milliseconds, that a connection can be idle before being released
  },
  dialectOptions: {
    ssl: {
      require: false,
      rejectUnauthorized: false, // Note: depending on your database setup this might be set to true
    },
  },
})

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
