const express = require('express');
const router = express.Router();

const { AuthController } = require('../controllers/auth/auth');
const webTemplateController = require('../controllers/web-template/web-template');

const authController = new AuthController();

router
    .get('/', webTemplateController.authPage)
    .get('/404', webTemplateController.notFoundPage)
    .post('/login', authController.loginUser)
    .post('/register', authController.registerUser)
    .get('/logout', authController.logoutUser);

module.exports = router;
