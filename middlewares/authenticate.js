const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
// Middleware to verify the JWT and set the current user on the request
const authenticate = async (req, res, next) => {
  try {
    // Get the token from the request header
    const token = req.header('Authorization').replace('Bearer ', '');
    
    // Verify the token
    const decoded = jwt.verify(token,  process.env.SECRET);
    
    // Find the user associated with the token
    const user = await User.findOne({ _id: decoded.userId });
    
    if (!user) {
      // If the user does not exist, return an error
      res.status(401).send('Invalid token');
    } else {
      // Set the user on the request object and call the next middleware
      req.user = user;
      next();
    }
  } catch (err) {
    console.error(err);
    res.status(401).send('Invalid token');
  }
};
module.exports = authenticate; 