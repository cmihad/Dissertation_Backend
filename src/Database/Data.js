// const { Client } = require('pg')

// const client = new Client({
//   user: 'postgres',
//   host: 'localhost',
//   database: 'rec',
//   password: 'admin',
//   port: 5432,
// })

// db.js
const pgp = require('pg-promise')()
const db = pgp('postgres://postgres:admin@localhost:5432/rec')

module.exports = db
