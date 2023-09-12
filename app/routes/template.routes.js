const express = require('express');
const router = express.Router();

const webTemplateController = require('../controllers/web-template.controller');

router
    .get('/', webTemplateController.listUsers)
    .get('/user-details', webTemplateController.getUserDetails)
    .get('/jsondb', webTemplateController.getJsonDb)
    .get('*', webTemplateController.notFound);

module.exports = router;
