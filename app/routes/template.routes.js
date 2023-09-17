const express = require('express');
const router = express.Router();

const webTemplateController = require('../controllers/web-template.controller');

router
    .get('/', webTemplateController.home)
    .get('/login', webTemplateController.loginPage)
    .get('/list', webTemplateController.listUsers)
    .get('/list/user-details', webTemplateController.getUserDetails)
    .get('/jsondb', webTemplateController.getJsonDb)
    .get('*', webTemplateController.notFound);

module.exports = router;
