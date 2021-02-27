const express = require('express')
const reviewRouter = express.Router()
const bodyParser = express.json()
const { v4: uuid } = require('uuid')

const ReviewsService = require('../reviews-service')
const jsonParser = express.json()
const xss = require('xss')
const path = require('path')

reviewRouter
  .route('/reviews/:id')
  .all((req, res, next) => {
    ReviewsService.getById(
      req.app.get('db'),
      req.params.id
    )
      .then(review => {
        if (!review) {
          return res.status(404).json({
            error: { message: `review doesn't exist` }
          })
        }
        res.review = review 
        next() 
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json({
      reviewId: res.review.review_id,
      bookId: xss(res.review.book_id), 
      title: res.review.title,
      contents: res.review.contents,
      helpCount: xss(res.review.help_count),
      user: res.review.user_id
    })

  })

module.exports = reviewRouter