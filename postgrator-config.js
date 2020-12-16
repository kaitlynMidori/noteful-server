require('dotenv').config();

 const {DATABASE_URL}  = require('./src/config')

module.exports = {
  "migrationsDirectory": "migrations",
  "driver": "pg",
  "connectionString": (process.env.NODE_ENV === 'test')
    ? process.env.TEST_DATABASE_URL
    : DATABASE_URL
};

