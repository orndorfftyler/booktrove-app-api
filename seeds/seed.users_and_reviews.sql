-- TRUNCATE all tables to ensure that there are no
-- data in them so we start with a fresh set of data
TRUNCATE reviews, users RESTART IDENTITY CASCADE;

INSERT INTO users (username, pw)
VALUES
    ('Bulbasaur','bbb'),
    ('Pikachu','ppp'),
    ('Squirtle', 'sss');

INSERT INTO reviews (reviewId, bookId, title, contents, helpCount)
VALUES
    ('b0715efe-ffaf-11e8-8eb2-f2801f1b9fd1', 'f2801f1b9fd1','Dracula was good', 'Corporis accusamus placeat quas non voluptas.', 5),
    ('b07161a6-ffaf-11e8-8eb2-f2801f1b9fd1', 'f2301f1b9fd1','Harry Potter was ok', 'Eos laudantium quia ab blanditiis', 8 ),
    ('b07162f0-ffaf-11e8-8eb2-f2801f1b9fd1', 'f2401f1b9fd1', 'Mixology was delicious', 'Occaecati dignissimos quam qui', 15);
  
UPDATE reviews SET userId = 1 WHERE id = 1;
UPDATE reviews SET userId = 2 WHERE id = 2;
UPDATE reviews SET userId = 3 WHERE id = 3;

