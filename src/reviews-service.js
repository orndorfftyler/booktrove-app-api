const ReviewsService = {
    getById(knex, id) {
        return knex.from('reviews').select('*').where('bookid', id).first()
    }
};

module.exports = ReviewsService;