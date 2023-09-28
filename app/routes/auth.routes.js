const express = require('express');
const router = express.Router();

const { AuthController } = require('../controllers/auth/auth');

const authController = new AuthController();

router
    .post('/', authController.registerUser);

module.exports = router;
