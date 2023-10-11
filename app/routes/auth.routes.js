const express = require('express');
const router = express.Router();

const { AuthController } = require('../controllers/auth/auth');
const webTemplateController = require('../controllers/web-template/web-template');

const authController = new AuthController();

router
    .get('/403', webTemplateController.accessDeniedPage)
    .get('/404', webTemplateController.notFoundPage)
    .get('/logout', authController.logoutUser)
    .get('/*', webTemplateController.authPage)
    .post('/login', authController.loginUser)
    .post('/register', authController.registerUser)
    .post('/forgotPassword', authController.forgotPassword)
    .post('/resetPassword', authController.resetPassword);

module.exports = router;
