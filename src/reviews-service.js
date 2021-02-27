const ReviewsService = {
    getById(knex, id) {
        return knex.from('reviews').select('*').where('book_id', id).first()
    }
};

module.exports = ReviewsService;