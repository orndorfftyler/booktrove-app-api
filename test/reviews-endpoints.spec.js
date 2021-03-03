const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')
const { makeUsersArray } = require('./users.fixtures');
const helpers = require('./reviews.fixtures')



describe('Review and User Endpoints', function() {

    let db

    before('make knex instance', () => {
      db = knex({
        client: 'pg',
        connection: process.env.TEST_DB_URL,
      })
      app.set('db', db)
    })
  
    after('disconnect from db', () => db.destroy())

    before('clean the table', () => db('reviews').truncate())

    afterEach('cleanup', () => db('reviews').truncate())
  ///////////////////////////////////////////////////////////////////////////////////////
    describe(`GET /reviewsperbook/:book_id`, () => {
        context(`Given no reviews for that book`, () => {
            it(`responds with 200 and an empty list`, () => {
            return supertest(app)
                .get('/bookmarks')
                .expect(200, [])
            })
        })
      context('Given there are bookmarks in the database', () => {
        const testBookmarks = makeBookmarksArray()
  
        beforeEach('insert bookmarks', () => {
          return db
            .into('bookmarks_table')
            .insert(testBookmarks)
        })
  
        it('responds with 200 and all of the bookmarks', () => {
          return supertest(app)
            .get('/bookmarks')
            .expect(200, testBookmarks)
        })
      })
    })
  /////////////////////////////////////////////////////////////////////////////////////////////
    describe(`GET /reviewsperbook/:book_id`, () => {
        context(`Given no reviews for that book`, () => {
          /*
          context(`Given an XSS attack bookmark`, () => {
            const maliciousBookmark = {
              id: 911,
              title: 'Naughty naughty very naughty <script>alert("xss");</script>',
              url: 'https://url.to.file.which/does-not.exist',
              rating: '3',
              desc: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`
            }
      
            beforeEach('insert malicious bookmark', () => {
              return db
                .into('bookmarks_table')
                .insert([ maliciousBookmark ])
            })
      
            it('removes XSS attack content', () => {
              return supertest(app)
                .get(`/api/bookmarks/${maliciousBookmark.id}`)
                .expect(200)
                .expect(res => {
                  expect(res.body.title).to.eql('Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;')
                  expect(res.body.desc).to.eql(`Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`)
                })
            })
          })
          */
            it(`responds with 200 and an empty list`, () => {
              return supertest(app)
                  .get('/reviewsperbook/f2801f1b9fd19000')
                  .set('Authorization', helpers.makeAuthHeader(testUsers[0]))

                  .expect(200, [])
              })
              /*
            it(`responds with 404`, () => {
            const id = 1
            return supertest(app)
                .get(`/api/bookmarks/${id}`)
                .expect(404, { error: { message: `bookmark doesn't exist` } })
            })
            */
        })
      context('Given there are reviews for a certain book', () => {
        const testUsers = makeUsersArray()
        const testReviews = helpers.makeReviewsArray()

        beforeEach('insert users', () => {
          return db
            .into('users')
            .insert(testUsers)
        })
        beforeEach('insert reviews', () => {
          return db
            .into('reviews')
            .insert(testReviews)
        })
  
        it('responds with 200 and reviews for the given book', () => {
          const expectedBookmark = testReviews[0]
          return supertest(app)
            .get(`/api/reviewsperbook/f2801f1b9fd1`)
            .set('Authorization', helpers.makeAuthHeader(testUsers[0]))

            .expect(200, expectedBookmark)
        })
      })
    }) 
    
  describe(`POST /reviewsperbook/:book_id`, () => {
    it(`creates a review, responding with 201 and the new bookmark`,  function() {
      this.retries(3)
      const newReview = {
        reviewId: 'c06b0127-4251-4178-a5d0-a20edf90fb7f',
        bookId: 'f2801f1b9fd1',
        title: 'POST test title',
        contents: 'review to post',
        helpCount: 3,
        user: 'Squirtle'
      }
      return supertest(app)
        .post('/bookmarks')
        .send(newBookmark)
        .expect(201)
        .expect(res => {
          expect(res.body.title).to.eql(newBookmark.title)
          expect(res.body.url).to.eql(newBookmark.url)
          expect(res.body.rating).to.eql(newBookmark.rating)
          expect(res.body.desc).to.eql(newBookmark.desc)
          expect(res.body).to.have.property('id')
          expect(res.headers.location).to.eql(`/bookmarks/${res.body.id}`)
        })
        .then(postRes =>
          supertest(app)
            .get(`/api/bookmarks/${postRes.body.id}`)
            .expect(postRes.body)
        )
    })
    
    const requiredFields = ['title', 'url', 'rating', 'desc']

    requiredFields.forEach(field => {
      const newBookmark = {
        title: 'post this bookmark',
        url: 'www.bookmark.com',
        rating: '5',
        desc: 'bookmark to post'
      }

      it(`responds with 400 and an error message when the '${field}' is missing`, () => {
        delete newBookmark[field]

        return supertest(app)
          .post('/bookmarks')
          .send(newBookmark)
          .expect(400, {
            error: { message: `Missing '${field}' in request body` }
          })
      })
    })
  })   
  describe(`DELETE /api/bookmarks/:id`, () => {
    context(`Given no bookmarks`, () => {
      it(`responds with 404`, () => {
        const id = 123456
        return supertest(app)
          .delete(`/api/bookmarks/${id}`)
          .expect(404, { error: { message: `bookmark doesn't exist` } })
      })
    })
    context('Given there are bookmarks in the database', () => {
      const testBookmarks = makeBookmarksArray()

      beforeEach('insert bookmarks', () => {
        return db
          .into('bookmarks_table')
          .insert(testBookmarks)
      })

      it('responds with 204 and removes the bookmark', () => {
        const idToRemove = 2
        const expectedBookmarks = testBookmarks.filter(bookmark => bookmark.id !== idToRemove)
        return supertest(app)
          .delete(`/api/bookmarks/${idToRemove}`)
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/bookmarks`)
              .expect(expectedBookmarks)
          )
      })
    })
  }) 
  describe.only(`PATCH /api/bookmarks/:id`, () => {
    context(`Given no bookmarks`, () => {
      it(`responds with 404`, () => {
        const id = 123456
        return supertest(app)
          .patch(`/api/bookmarks/${id}`)
          .expect(404, { error: { message: `bookmark doesn't exist` } })
      })
    })
    context('Given there are bookmarks in the database', () => {
      const testBookmarks = makeBookmarksArray()

      beforeEach('insert bookmarks', () => {
        return db
          .into('bookmarks_table')
          .insert(testBookmarks)
      })

      it('responds with 204 and updates the bookmark', () => {
        const idToUpdate = 2
        const updateBookmark = {
          title: 'updated',
          url: 'wwwurl',
          rating: '8',
          desc: 'test'
        }
        const expectedBookmark = {
          ...testBookmarks[idToUpdate - 1],
          ...updateBookmark
        }
        return supertest(app)
          .patch(`/api/bookmarks/${idToUpdate}`)
          .send(updateBookmark)
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/bookmarks/${idToUpdate}`)
              .expect(expectedBookmark)
          )
      })
      it(`responds with 400 when no required fields supplied`, () => {
        const idToUpdate = 2
        return supertest(app)
          .patch(`/api/bookmarks/${idToUpdate}`)
          .send({ irrelevantField: 'foo' })
          .expect(400, {
            error: {
              message: `Request body must contain either 'title', 'url', 'rating', or 'desc'`
            }
          })
      })
      it(`responds with 204 when updating only a subset of fields`, () => {
          const idToUpdate = 2
          const updateBookmark = {
            title: 'updated bookmark title',
          }
          const expectedBookmark = {
            ...testBookmarks[idToUpdate - 1],
            ...updateBookmark
          }
    
          return supertest(app)
            .patch(`/api/bookmarks/${idToUpdate}`)
            .send({
              ...updateBookmark,
              fieldToIgnore: 'should not be in GET response'
            })
            .expect(204)
            .then(res =>
              supertest(app)
                .get(`/api/bookmarks/${idToUpdate}`)
                .expect(expectedBookmark)
            )
        })

    })
    })

})