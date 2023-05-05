const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

exports.registerUser = async (req, res, next) => {
  try {
    // Check if a user with the given email already exists
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(409).send('Email already exists');
    }
    // Create a new user with the provided data
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      birthday: req.body.birthday
    });
    
    // Save the user to the database
    await user.save();
    
    // Generate a token for the user
    const token = jwt.sign({ userId: user._id }, process.env.SECRET);
    
    // Return the token to the client
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    // Find the user with the provided email address
    const user = await User.findOne({ email: req.body.email });
    
    // Verify the password against the hashed password
    const isPasswordValid = await user.verifyPassword(req.body.password);
    
    if (!user || !isPasswordValid) {
      // If the user does not exist or the password is incorrect, return an error
      res.status(401).send('Invalid email or password');
    } else {
      // Generate a token for the user
      const token = jwt.sign({ userId: user._id }, secretKey);
      
      // Return the token to the client
      res.json({ token });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.getUsers = async (req, res, next) => {
try {
  // Find all users in the database and exclude the password field
  const users = await User.find().select('-password');
  res.json(users);
} catch (err) {
  console.error(err);
  res.status(500).send('Server error');
}
};

