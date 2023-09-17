const express = require('express');
const router = express.Router();

const webTemplateController = require('../controllers/web-template.controller');

router
    .get('/', webTemplateController.redirectToHomePage)
    .get('/login', webTemplateController.loginPage)
    .get('/list', webTemplateController.listOfUsersPage)
    .get('/list/user-details', webTemplateController.getUserDetailsPage)
    .get('/jsondb', webTemplateController.getJsonDb)
    .get('*', webTemplateController.notFoundPage);

module.exports = router;
