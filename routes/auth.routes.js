const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authenticate = require("../middlewares/authenticate");
// Route for user registration
router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
router.get('/users',authenticate, authController.getUsers);

module.exports = router;
