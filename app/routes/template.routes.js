const express = require('express');
const router = express.Router();

const webTemplateController = require('../controllers/web-template/web-template');

router
    .get('/', webTemplateController.redirectToHomePage)
    .get('/users', webTemplateController.listOfUsersPage)
    .get('/users/user-details', webTemplateController.getUserDetailsPage)
    .get('/jsondb', webTemplateController.getJsonDb);

module.exports = router;
