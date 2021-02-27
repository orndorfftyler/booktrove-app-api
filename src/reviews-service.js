const ReviewsService = {
    getById(knex, id) {
        return knex.from('reviews').select('*').where('bookId', id).first()
    }
};

module.exports = ReviewsService;