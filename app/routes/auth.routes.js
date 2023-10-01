const express = require('express');
const router = express.Router();

const { AuthController } = require('../controllers/auth/auth');

const authController = new AuthController();

router
    .post('/login', authController.loginUser)
    .post('/register', authController.registerUser);

module.exports = router;
