CREATE TABLE helpful (
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  user_id INTEGER REFERENCES users(id),
  review_id UUID NOT NULL
);



