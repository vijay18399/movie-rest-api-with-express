// Import the Movie model and Redis library
const Movie = require("../models/movie.model");
const redis = require("redis");

// Set up Redis client and URL
const redisUrl = process.env.REDIS_URL || "redis://127.0.0.1:6379";
const client = redis.createClient(redisUrl);

// Handler function for GET /movies endpoint
exports.getMovies = async (req, res) => {
  try {
    // Extract query parameters from request object
    const {
      title,
      genres,
      year,
      actors,
      directors,
      page = 1,
      limit = 10,
      getAll = 0,
    } = req.query;

    // Build query object based on query parameters
    const query = {};

    if (title) {
      query.title = { $regex: title, $options: "i" };
    }

    if (genres) {
      query.genres = { $in: genres.split(",") };
    }

    if (year) {
      const yearFilter = {};
      yearFilter.$eq = parseInt(year);
      query.year = yearFilter;
    }

    if (actors) {
      const actors = req.query.actors.split(",");
      query.actors = { $all: actors };
    }

    if (directors) {
      query.directors = { $in: directors.split(",") };
    }

    // Get count of total movies matching query
    const count = await Movie.countDocuments(query);

    let movies;
    // Check if getAll query parameter is truthy
    if (getAll) {
      // Retrieve all movies that match query
      movies = await Movie.find(query);
    } else {
      // Retrieve a limited number of movies that match query based on pagination parameters
      movies = await Movie.find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ title: 1 });
    }

    // Send response with JSON payload containing movie data
    res.status(200).json({
      total: movies.length,
      data: movies,
      page: page,
      totalPages: Math.ceil(count / limit),
    });
  } catch (err) {
    console.error(err);
    // Send error response if an exception occurred
    res.status(500).json({ message: "Server error" });
  }
};

// Handler function for GET /movies/:id endpoint
exports.getMovieById = async (req, res) => {
  try {
    // Retrieve movie by ID from MongoDB
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      // Send 404 response if movie not found
      res.status(404).json({ message: "Movie not found" });
    } else {
      // Store movie in Redis cache for an hour and send response with movie data
      client.setex(req.originalUrl, 3600, JSON.stringify(movie));
      res.json(movie);
    }
  } catch (err) {
    console.error(err);
    // Send error response if an exception occurred
    res.status(500).json({ message: "Server error" });
  }
};

// Handler function for POST /movies endpoint
exports.createMovie = async (req, res) => {
  try {
    // Create new movie record in MongoDB using request body
    const movie = await Movie.create(req.body);
    // Send success response with newly created movie record
    res.status(201).json({
      status: "success",
      data: {
        movie,
      },
    });
  } catch (err) {
    console.error(err);
    // Send error response if an exception occurred during creating new movie record
    res.status(400).json({
      status: "fail",
      message: "Invalid data",
    });
  }
};

// Handler function for PUT /movies endpoint
exports.updateMovie = async (req, res) => {
  try {
    // Update movie record in MongoDB using id and request body
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    // Send success response with updated movie record
    res.status(200).json({
      status: "success",
      data: {
        movie,
      },
    });
  } catch (err) {
    console.error(err);
    // Send error response if an exception occurred during updating movie record
    res.status(400).json({
      status: "fail",
      message: "Invalid data",
    });
  }
};

// Handler function for DELETE /movies endpoint
exports.deleteMovie = async (req, res) => {
  try {
    // Delete movie record in MongoDB using id
    await Movie.findByIdAndDelete(req.params.id);
    // Send success response with null data
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    console.error(err);
    // Send error response if an exception occurred during deleting movie record or invalid movie id is provided
    res.status(400).json({
      status: "fail",
      message: "Invalid movie id",
    });
  }
};
