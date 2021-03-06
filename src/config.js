module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    //DATABASE_URL: process.env.DATABASE_URL || 'postgresql://booktrover@localhost/booktrove',
    DATABASE_URL: process.env.DATABASE_URL+'?ssl=true' || 'postgresql://admin@localhost/book_db',
    JWT_SECRET: process.env.JWT_SECRET || 'books-are-great',
}