const knex = require('knex')({
    client: 'mysql',
    connection: {
      user: 'admin',
      password:'asd123',
      database:'tabletopgames'
    }
  })
  const bookshelf = require('bookshelf')(knex)
  
  module.exports = bookshelf;