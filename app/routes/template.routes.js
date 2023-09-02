const express = require('express');
const router = express.Router();

const templateController = require('./../controllers/template.controller');

router
    .get('/', templateController.listUsers)
    .get('/user-details', templateController.getUserDetails)
    .get('/jsondb', templateController.getJsonDb)
    .get('*', templateController.notFound);

module.exports = router;
