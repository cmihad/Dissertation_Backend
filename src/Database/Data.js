// const { Client } = require('pg')

const { Pool } = require('pg')
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'rec',
  password: 'admin',
  port: 5432,
})

// db.js

// const pgp = require('pg-promise')()
// const db = pgp('postgres://postgres:admin@localhost:5432/rec')
pool.on('connect', () => {
  console.log('Connected to the database')
})

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
})
module.exports = pool
