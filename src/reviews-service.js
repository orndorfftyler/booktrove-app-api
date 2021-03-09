const ReviewsService = {
    getAllReviewsPerBook(knex, book_id) {
        return knex.from('reviews').select('*').where('book_id', book_id);

    },
    insertReview(knex, newRev) {
        let newId = knex.from('users').select('id').where('username', newRev.user).first()//.then(rows => {return rows[0]});
        newRev.user_id = newId;
        delete newRev.user;

        console.log(newId);

        return knex
            .insert(newRev)
            .into('reviews')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
            
    },
    getById(knex, review_id) {
        return knex.from('reviews').select('*').where('review_id', review_id).first()
    },
    deleteReview(knex, review_id) {
        return knex.from('reviews').select('*').where('review_id', review_id).delete()
    },
    updateReview(knex, review_id, newReviewFields) {
        return knex.from('reviews').select('*').where('review_id', review_id).first().update(newReviewFields)
    },
    getUserId(knex, username) {
        return knex.from('users').select('id').where('username', username).first()
    },
    getHelpfulByBookId(knex, book_id) {
        return knex.from('helpful').select('*').where('book_id', book_id)
    },
    insertHelpful(knex, helpful) {

        return knex
            .insert(helpful)
            .into('helpful')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
            
    },
    getHelpfulByUserId(knex, user_id) {
        return knex.from('helpful').select('*').where('user_id', user_id)
    },
    getHelpfulByReviewId(knex, review_id) {
        return knex.from('helpful').select('*').where('review_id', review_id)
    },
    deleteHelpful(knex, review_id, user_id) {
        return knex.from('helpful').select('*').where({
            review_id: review_id,
            user_id: user_id
          }).delete()
    },
};

module.exports = ReviewsService;