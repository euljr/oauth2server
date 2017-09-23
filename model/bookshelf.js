const knex = require('knex')({
    client: process.env.DATABASE,
    connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        charset: 'utf8'
    }
});

const bookshelf = require('bookshelf')(knex);
module.exports = bookshelf;