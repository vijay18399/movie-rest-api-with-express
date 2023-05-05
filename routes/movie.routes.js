const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movie.controller');
const cache = require("../middlewares/cache");

router.get('/movies',  movieController.getMovies );
router.get('/movies/:id',cache, movieController.getMovieById);
router.post('/movies', movieController.createMovie);
router.put('/movies/:id', movieController.updateMovie);
router.delete('/movies/:id', movieController.deleteMovie);
module.exports = router;
