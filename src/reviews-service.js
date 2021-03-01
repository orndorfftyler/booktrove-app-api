const ReviewsService = {
    getAllReviewsPerBook(knex, book_id) {
        let bookReviews = knex.from('reviews').select('*').where('book_id', book_id);

        /*
        for (let i = 0; i < bookReviews.length; i++) {
            bookReviews[i]['username'] = 'test';//knex.from('users').select('username').where('id', bookReviews[i]['user_id']).first();
        }
        */
       let outArr = [];
       for (let i = 0; i < bookReviews.length; i++ ){
         let temp = {};
         temp.reviewId = bookReviews[i]['review_id'];
         temp.bookId = bookReviews[i]['book_id'];
         temp.title = bookReviews[i]['title'];
         temp.contents = bookReviews[i]['contents'];
         temp.helpCount = bookReviews[i]['help_count'];
         temp.user = bookReviews[i]['user_id'];
         outArr.push(temp);
       }
     


        return outArr;
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
    }
};

module.exports = ReviewsService;