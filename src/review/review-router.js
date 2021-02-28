const express = require('express')
const reviewRouter = express.Router()
const bodyParser = express.json()
const { v4: uuid } = require('uuid')

const ReviewsService = require('../reviews-service')
const jsonParser = express.json()
const xss = require('xss')
const path = require('path')

function processReviews(arrObj) {
  
  let outArr = [];
  for (let i = 0; i < arrObj.length; i++ ){
    let temp = {};
    temp.reviewId = arrObj[i]['review_id'];
    temp.bookId = arrObj[i]['book_id'];
    temp.title = arrObj[i]['title'];
    temp.contents = arrObj[i]['contents'];
    temp.helpCount = arrObj[i]['help_count'];
    temp.user = arrObj[i]['user_id'];
    outArr.push(temp);
  }
  return outArr;
}


reviewRouter
  .route('/reviewsperbook/:book_id')
  .get((req, res, next) => {
    ReviewsService.getAllReviewsPerBook(
      req.app.get('db'),
      req.params.book_id
    )
      .then(reviews => {
        let procRev = processReviews(reviews);
        res.json(procRev)
      })
      .catch(next)
  })
    
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
        .location(path.posix.join(req.originalUrl, `/${review.book_id}`))
        .json(review)
    })
  .catch(next)
  })

reviewRouter
  .route('/reviews/:review_id')
  .all((req, res, next) => {
    ReviewsService.getById(
      req.app.get('db'),
      req.params.review_id
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
  .delete((req, res, next) => {
    ReviewsService.deleteReview(
      req.app.get('db'),
      req.params.review_id
    )
    .then(() => {
      res.status(204).end()
    })
    .catch(next)  
  })
  .patch(jsonParser, (req, res, next) => {
    let { reviewId, bookId, title, contents, helpCount, user } = req.body
    let updateRev = { reviewId, bookId, title, contents, helpCount, user }

    const numberOfValues = Object.values(updateRev).filter(Boolean).length
    if (numberOfValues === 0) {
      return res.status(400).json({
        error: {
          message: `Request body must contain reviewId, bookId, title, contents, helpCount, user`
        }
      })
    }

    updateRev.review_id = updateRev.reviewId;
    updateRev.book_id = updateRev.bookId;
    updateRev.help_count = updateRev.helpCount;
    delete updateRev.reviewId;
    delete updateRev.bookId;
    delete updateRev.helpCount;
    
    ReviewsService.updateReview(
      req.app.get('db'),
      req.params.review_id,
      updateRev
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })



module.exports = reviewRouter