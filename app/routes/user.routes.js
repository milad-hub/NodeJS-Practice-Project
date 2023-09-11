const express = require('express');
const router = express.Router();

const { UserController, UserAggregationController } = require('./../controllers/user.controller');
const { getOldestUsers, getActiveUsers } = require('../middlewares/user.middleware');

const userController = new UserController();
const userAggregationController = new UserAggregationController();

router
    .get('/active-users', getActiveUsers, userController.listUsers)
    .get('/oldest-users', getOldestUsers, userController.listUsers);

router
    .get('/stats', userAggregationController.getUserStats)
    .get('/age/:age', userAggregationController.getFilterUserByAge);

router
    .get('/', userController.listUsers)
    .get('/:id', userController.getUser)
    .post('/', userController.createUser)
    .patch('/:id', userController.updateUser)
    .delete('/:id', userController.deleteUser);

module.exports = router;
