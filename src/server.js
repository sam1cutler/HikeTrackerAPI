const knex = require('knex');
const app = require('./app')
const { PORT, DATABASE_URL } = require('./config');

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const db = knex({
    client: 'pg',
    connection: DATABASE_URL,
})

app.set('db', db);

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});