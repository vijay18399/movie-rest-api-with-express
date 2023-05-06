const express = require('express');
const mongoose = require('mongoose');
require("dotenv/config");
const movieRoutes = require('./routes/movie.routes');
const authRoutes = require('./routes/auth.routes');
const cors = require('cors');  
const app = express();   
app.use(cors()); 
// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI , { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

// Add middleware to parse request body
app.use(express.json());

// Add routes
app.use('/auth', authRoutes);
app.use('/', movieRoutes);

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
