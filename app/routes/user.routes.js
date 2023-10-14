const httpParameterPollution = require('hpp');
const express = require('express');
const router = express.Router();

const { UserController, UserAggregationController } = require('./../controllers/users/user');
const { getOldestUsers, getActiveUsers } = require('../middlewares/user.middleware');
const { hppOptions } = require('../config/config');

const userController = new UserController();
const userAggregationController = new UserAggregationController();

router
    .get('/active-users', getActiveUsers, userController.getUsersList)
    .get('/oldest-users', getOldestUsers, userController.getUsersList);

router
    .get('/stats', userAggregationController.getUserStats)
    .get('/age/:age', userAggregationController.getFilterUserByAge);

router
    .get('/', httpParameterPollution(hppOptions), userController.getUsersList)
    .get('/:id', userController.getUser)
    .patch('/:id', userController.updateUser)
    .delete('/:id', userController.deleteUser);

module.exports = router;
