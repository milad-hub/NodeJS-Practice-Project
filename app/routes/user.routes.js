const express = require('express');
const router = express.Router();

const { getOldestUsers } = require('../middlewares/user.middleware');
const userController = require('./../controllers/user.controller');

router
    .get('/oldest-users', getOldestUsers, userController.listUsers)
    .get('/', userController.listUsers)
    .get('/:id', userController.getUser)
    .post('/', userController.createUser)
    .patch('/:id', userController.updateUser)
    .delete('/:id', userController.deleteUser);

module.exports = router;
