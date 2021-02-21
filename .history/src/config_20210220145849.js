module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || "development",
  
    "development": {
      "username": "tomkadwill",
      "password": "password",
      "database": "urlshortener_development",
      "host": "localhost",
      "dialect": "postgres",
      "operatorsAliases": false
    },
  
  
  DATABASE_URL: process.env.DATABASE_URL + (process.env.NODE_ENV === 'production' ? '?ssl=true' : '') || 'postgresql://postgres@localhost/noteful',
  TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || 'postgresql://postgres@localhost/noteful-test'
};
// DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres@localhost/noteful',

