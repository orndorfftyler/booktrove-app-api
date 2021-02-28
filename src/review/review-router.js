const express = require('express')
const reviewRouter = express.Router()
const bodyParser = express.json()
const { v4: uuid } = require('uuid')

const ReviewsService = require('../reviews-service')
const jsonParser = express.json()
const xss = require('xss')
const path = require('path')


reviewRouter
  .route('/reviews/:book_id')
  .get((req, res, next) => {
    ReviewsService.getAllReviewsPerBook(
      req.app.get('db'),
      req.params.book_id
    )
      .then(reviews => {
        res.json(reviews)
      })
      .catch(next)
  })
    /*
  .post(jsonParser, (req, res, next) => {
    let { reviewId, bookId, title, contents, helpCount, user } = req.body
    let newRev = { reviewId, bookId, title, contents, helpCount, user }
    
    for (const [key, value] of Object.entries(newRev)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })
      }
    }

    newRev.review_id = newRev.reviewId;
    newRev.book_id = newRev.bookId;
    newRev.help_count = newRev.helpCount;
    delete newRev.reviewId;
    delete newRev.bookId;
    delete newRev.helpCount;


    ReviewsService.insertReview(
      req.app.get('db'),
      newRev
    )
    .then(review => {
      res
        .status(201)
        //.location(path.posix.join(req.originalUrl, `/${review.book_id}`))
        .json(review)
    })
  .catch(next)
  })
*/

/*
reviewRouter
  .route('/reviews/:book_id')
  .all((req, res, next) => {
    ReviewsService.getById(
      req.app.get('db'),
      req.params.book_id
    )
      .then(review => {
        if (!review) {
          return res.status(404).json({
            error: { message: `book doesn't exist` }
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

    */


module.exports = reviewRouter