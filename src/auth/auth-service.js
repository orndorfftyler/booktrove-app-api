const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
//const Knex = require('knex')
const config = require('../config')

const AuthService = {
  getUserWithUserName(knex, user_name) {
    return knex.from('users').select('*')
      .where('username', user_name)
      //.where('book_id', book_id);
      .first()
  },
  comparePasswords(password, hash) {
    return bcrypt.compare(password, hash)
  },
  createJwt(subject, payload) {
    return jwt.sign(payload, config.JWT_SECRET, {
      subject,
      algorithm: 'HS256',
    })
  },
  verifyJwt(token) {
    return jwt.verify(token, config.JWT_SECRET, {
      algorithms: ['HS256'],
    })
  },
  parseBasicToken(token) {
    return Buffer
      .from(token, 'base64')
      .toString()
      .split(':')
  },
}

module.exports = AuthService
