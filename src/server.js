const { PORT, DATABASE_URL } = require('./config')

const app = require('./app')
const knex = require('knex')

const db = knex({
  client: 'pg',
  //connection: DATABASE_URL+'?ssl=true'
  connection: DATABASE_URL

})

app.set('db', db)
  

app.listen(PORT, () => {
  console.log(`Server listening at ${PORT}`)
})