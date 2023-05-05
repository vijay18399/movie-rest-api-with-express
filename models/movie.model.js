const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  movieId: { type: String, required: true },
  title: { type: String, required: true },
  year: Number,
  genres: [String],
  audience_rating: String,
  runtime: Number,
  rating: Number,
  lq_poster: String,
  poster: String,
  actors: [String],
  directors: [String]
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
