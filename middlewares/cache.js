// Import Redis package and define Redis server URL
const redis = require('redis');
const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

// Create Redis client to connect to Redis server
const client = redis.createClient(redisUrl);

// Middleware function to check if requested data exists in Redis cache
const cache = (req, res, next) => {
  // Set cache key as the requested URL
  const key = req.originalUrl;

  // Retrieve cached data if available
  client.get(key, (err, data) => {
    if (err) throw err;
    if (data !== null) {
      res.status(200).json(JSON.parse(data));
    } else {
      // If cached data doesn't exist, proceed to the next middleware function
      next();
    }
  });
};

module.exports = cache; // Export cache middleware function.