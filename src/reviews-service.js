const ReviewsService = {
    getById(knex, id) {
        return knex.from('reviews').select('*').where('book_id', id).first()
    },
    insertReview(knex, newRev) {
        let newId = knex.from('users').select('id').where('username', newRev.user).first()//.then(rows => {return rows[0]});
        newRev.user_id = newId;
        console.log(newId);

        return knex
            .insert(newRev)
            .into('reviews')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
            
    },

};

module.exports = ReviewsService;