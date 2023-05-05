# Movie API

This is a RESTful API for managing movies.

## Features

- User registration and authentication using JWT tokens
- MongoDB for storing user and movie data
- Redis for caching movie data
- Filtering movies by title, genre, and year
- Creating, updating, and deleting movies
- Getting a single movie by ID

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Redis
- JWT

## Installation

1. Clone the repository: `git clone https://github.com/example/movie-api.git`
2. Install dependencies: `npm install`
3. Set environment variables in a `.env` file:
   - `MONGO_URI`: URI for your MongoDB instance
   - `JWT_SECRET`: secret key for JWT token generation
   - `REDIS_PORT`: Redis server port number (default: 6379)
   - `REDIS_HOST`: Redis server host (default: localhost)
5. Import movies.json into your database using mongodb Compass
4. Start the server: `npm start`

## Endpoints

### Authentication

- POST /auth/register - register a new user
- POST /auth/login - login with email and password to get JWT token
- GET /auth/users - get list of registered users 

### Movies

- GET /movies - get a list of movies (supports filtering by title, genre, and year etc..)
- GET /movies/:id - get a single movie by ID
- POST /movies - create a new movie
- PUT /movies/:id - update a movie by ID
- DELETE /movies/:id - delete a movie by ID

## Caching

- Redis is used to cache movie data for faster retrieval. When a movie is requested by ID, the API first checks if it exists in the Redis cache. If not, it retrieves it from MongoDB and adds it to the cache. Subsequent requests for the same movie will be served from the cache, improving performance.

## Filtering

- The `/movies` endpoint supports filtering by title, genre, and year. Filtering is done by passing query parameters in the URL, like this: `/movies?title=RRR`.

## Authentication

- User registration and authentication is done using JWT tokens. When a user logs in with their email and password, the API generates a JWT token, which is then used to authenticate subsequent requests. The token is passed in the `Authorization` header, like this: `Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`.


