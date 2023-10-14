const helmet = require('helmet');
const express = require('express');
const router = express.Router();

const { AuthController } = require('../controllers/auth/auth');
const webTemplateController = require('../controllers/web-template/web-template');
const { helmetOptions } = require('../config/config');

const authController = new AuthController();

router
    .get('/403', webTemplateController.accessDeniedPage)
    .get('/404', webTemplateController.notFoundPage)
    .get('/logout', helmet(helmetOptions), authController.logoutUser)
    .get('/*', webTemplateController.authPage)
    .post('/login', helmet(helmetOptions), authController.loginUser)
    .post('/register', helmet(helmetOptions), authController.registerUser)
    .post('/forgotPassword', helmet(helmetOptions), authController.forgotPassword)
    .patch('/resetPassword', helmet(helmetOptions), authController.resetPassword);

module.exports = router;
