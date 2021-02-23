const knex = require('knex')
const app = require('./app')
const { PORT, DATABASE_URL } = require('./config')

const db = knex({
  client: 'pg',
  connection: DATABASE_URL,
})

app.set('db', db)

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})

// const db = knex({
//   client: 'pg',
//   connection: DATABASE_URL,
//   ssl: { rejectUnauthorized: false }
// });

// app.set('db', db);

// app.listen(PORT, () => {
//   console.log(DATABASE_URL)
//   console.log(`Express server is listening at http://localhost:${PORT}`);
// });
